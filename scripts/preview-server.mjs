#!/usr/bin/env node
// Faithful local mirror of the production static host (Vercel, `cleanUrls:false`).
//
// Why a custom server instead of `serve` / `http-server` / `sirv`? Our URL
// contract is a HYBRID: clean directory-index URLs for new posts
// (`/slug-YYYYMMDD` → `<slug-YYYYMMDD>/index.html`) AND frozen flat `.html`
// files for legacy posts (`/2009/02/13/000207.html`). Off-the-shelf static
// servers couple two behaviors we need to keep apart:
//   • serve-handler (`serve`): the directory→`index.html` resolution is gated
//     behind `cleanUrls`, which ALSO 301-strips `.html`. So `cleanUrls:false`
//     makes every clean URL render a directory LISTING, while `cleanUrls:true`
//     301-redirects the legacy `.html` away. Neither matches prod.
//   • sirv / http-server: the default `.html` extension fallback makes the
//     extensionless `/2009/02/13/000207` resolve to `…207.html`, but prod 404s
//     it (legacy posts are reachable ONLY via their `.html` URL).
//
// The contract is exactly nginx's `try_files $uri $uri/index.html =404`:
//   1. exact file hit            → serve as-is (legacy `.html`, assets, rss.xml…)
//   2. else `<path>/index.html`  → serve (clean URLs, redirect stubs, homepage)
//   3. else                      → 404 (+ dist/404.html body)
// No `.html` stripping, no trailing-slash redirects. This reproduces 1:1 on any
// static host, so it doubles as the portable spec of the URL contract.
//
// HTTPS over Tailscale: if the anyip cert is present (`pnpm cert:anyip`), serve
// HTTPS bound to all interfaces (reachable at https://<dashed-ip>.anyip.dev:4321);
// otherwise plain HTTP on localhost only, so preview is never LAN-exposed sans TLS.

import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer as createHttpServer } from "node:http";
import { createServer as createHttpsServer } from "node:https";
import { extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("../dist", import.meta.url)));
const PORT = Number(process.env.PORT) || 4321;
const CERT = resolve(fileURLToPath(new URL("../.cert/anyip/fullchain.pem", import.meta.url)));
const KEY = resolve(fileURLToPath(new URL("../.cert/anyip/privkey.pem", import.meta.url)));

// Mirror Vercel's host-level redirects so `pnpm preview` matches prod 1:1: read
// `vercel.json`'s `redirects` and serve a real 308/307 BEFORE touching the
// filesystem (Vercel runs redirects ahead of static files). The static
// meta-refresh stubs Astro bakes for the same sources stay as the portable
// fallback for hosts without this config (e.g. GitHub Pages).
const REDIRECTS = (() => {
  const map = new Map();
  try {
    const cfg = JSON.parse(
      readFileSync(fileURLToPath(new URL("../vercel.json", import.meta.url)), "utf8"),
    );
    for (const r of cfg.redirects ?? []) {
      if (r?.source && r?.destination) {
        map.set(r.source, { to: r.destination, code: r.permanent === false ? 307 : 308 });
      }
    }
  } catch {
    // no vercel.json / unreadable → plain static serving, no redirects
  }
  return map;
})();

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".xsl": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".map": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".wasm": "application/wasm",
};

function isFile(p) {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
}

/**
 * Map a request pathname to a file on disk per the prod static contract.
 * Returns an absolute path inside ROOT, or null for a 404.
 */
function resolveFile(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null; // malformed percent-encoding → 404 instead of a thrown URIError
  }
  if (decoded.includes("\0")) return null; // reject NUL-byte paths

  // Resolve under ROOT, then confine with `path.relative` (the is-path-inside
  // idiom): anything climbing out of ROOT yields a `..`-prefixed or absolute
  // relative path → 404. Also rejects a sibling dir that merely shares ROOT's
  // prefix, which a plain `startsWith(ROOT)` check would wrongly admit.
  const abs = resolve(ROOT, `.${decoded.startsWith("/") ? decoded : `/${decoded}`}`);
  const rel = relative(ROOT, abs);
  if (rel.startsWith("..") || isAbsolute(rel)) return null;

  // 1. exact file (legacy `.html`, hashed assets, rss.xml, CNAME, …)
  if (!decoded.endsWith("/") && isFile(abs)) return abs;
  // 2. directory index (clean URLs, ③→④ / old-note redirect stubs, homepage)
  const indexPath = join(abs, "index.html");
  if (isFile(indexPath)) return indexPath;
  return null;
}

function log(req, status) {
  // Strip control chars from method/target before logging (log-injection guard).
  const method = String(req.method).replace(/[^A-Za-z]/g, "");
  const target = String(req.url).replace(/[\r\n]/g, "");
  console.log(`${status} ${method} ${target}`);
}

function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8", Allow: "GET, HEAD" });
    res.end("405 Method Not Allowed");
    log(req, 405);
    return;
  }

  const pathname = (req.url || "/").split("?")[0];

  // Host-level redirects (mirrors vercel.json), applied before the filesystem.
  const redirect = REDIRECTS.get(pathname);
  if (redirect) {
    res.writeHead(redirect.code, { Location: redirect.to });
    res.end();
    log(req, redirect.code);
    return;
  }

  const file = resolveFile(pathname);

  if (!file) {
    const fallback = join(ROOT, "404.html");
    const body = isFile(fallback) ? readFileSync(fallback) : Buffer.from("404 Not Found");
    res.writeHead(404, {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Length": body.length,
    });
    res.end(req.method === "HEAD" ? undefined : body);
    log(req, 404);
    return;
  }

  const type = MIME[extname(file).toLowerCase()] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type, "Content-Length": statSync(file).size });
  if (req.method === "HEAD") {
    res.end();
  } else {
    createReadStream(file).pipe(res);
  }
  log(req, 200);
}

if (!existsSync(ROOT)) {
  console.error(`✗ dist/ not found at ${ROOT} — run \`pnpm build\` first.`);
  process.exit(1);
}

const hasCert = existsSync(CERT) && existsSync(KEY);
const server = hasCert
  ? createHttpsServer({ cert: readFileSync(CERT), key: readFileSync(KEY) }, handler)
  : createHttpServer(handler);
const host = hasCert ? "0.0.0.0" : "127.0.0.1";

server.listen(PORT, host, () => {
  if (hasCert) {
    console.log(
      `🔒 HTTPS on all interfaces — open https://<dashed-tailscale-ip>.anyip.dev:${PORT}  (tailscale ip -4)`,
    );
  } else {
    console.log(
      `🌐 HTTP on localhost — http://localhost:${PORT}  (run \`pnpm cert:anyip\` for HTTPS over Tailscale)`,
    );
  }
  console.log(`   prod static mirror of ${ROOT}  (try_files $uri $uri/index.html =404)`);
});
