// Ensure the anyip.dev wildcard cert is present (and unexpired) so `pnpm dev`
// serves HTTPS for remote debugging over Tailscale. Idempotent: skips the
// network when a valid cert already exists; pass `--force` to refetch anyway.
//
// The cert is a real Let's Encrypt wildcard for `*.anyip.dev` whose private key
// is intentionally public — transport security comes from Tailscale, this just
// satisfies browsers' secure-context requirement. astro.config.ts auto-serves
// HTTPS (and binds all interfaces on :4321) whenever the cert is present, so
// this script is what flips `pnpm dev` into Tailscale/LAN mode. Run `astro dev`
// directly (no prestep) to stay localhost-only. See AGENTS.md → "Remote
// debugging over Tailscale".
import { X509Certificate } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";

const dir = new URL("../.cert/anyip/", import.meta.url);
const certPath = new URL("fullchain.pem", dir);
const keyPath = new URL("privkey.pem", dir);
const SOURCE = "https://anyip.dev/cert";
const RENEW_BEFORE_MS = 7 * 24 * 60 * 60 * 1000; // refetch when <7 days remain
const force = process.argv.includes("--force");

/** Both files exist, the cert parses, and it isn't within 7 days of expiry. */
function certIsFresh() {
  try {
    if (!existsSync(certPath) || !existsSync(keyPath)) return false;
    const { validTo } = new X509Certificate(readFileSync(certPath));
    return Date.parse(validTo) - Date.now() > RENEW_BEFORE_MS;
  } catch {
    return false;
  }
}

async function download(name) {
  const res = await fetch(`${SOURCE}/${name}`);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

if (!force && certIsFresh()) {
  console.log("✓ anyip cert present and unexpired — HTTPS dev ready (skipping fetch)");
  process.exit(0);
}

try {
  const [cert, key] = await Promise.all([download("fullchain.pem"), download("privkey.pem")]);
  const { validTo } = new X509Certificate(cert); // also rejects an HTML error page
  await mkdir(dir, { recursive: true });
  await Promise.all([writeFile(certPath, cert), writeFile(keyPath, key)]);
  console.log(`✓ anyip cert fetched into .cert/anyip/ (valid until ${validTo}) — dev serves HTTPS on :4321`);
} catch (err) {
  // Renewal failed (offline / anyip down). Exit 0 either way so the chained
  // `astro dev` still starts. If a usable cert is still on disk, keep serving
  // HTTPS with it; otherwise delete the stale/corrupt files so astro.config.ts
  // falls back to localhost-only HTTP instead of trying to serve a bad cert.
  if (certIsFresh()) {
    console.warn(`⚠ anyip cert refresh failed (${err.message}); keeping the existing valid cert`);
  } else {
    await rm(dir, { recursive: true, force: true });
    console.warn(`⚠ anyip cert fetch failed (${err.message}); removed stale cert → dev falls back to localhost HTTP`);
  }
  process.exit(0);
}
