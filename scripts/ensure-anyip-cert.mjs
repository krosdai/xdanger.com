// Ensure the anyip.dev wildcard cert is present (and unexpired) so `pnpm dev`
// serves HTTPS for remote debugging over Tailscale. Idempotent: skips the
// network when a valid cert already exists; pass `--force` to refetch anyway.
//
// The cert is a real Let's Encrypt wildcard for `*.anyip.dev` whose private key
// is intentionally public — transport security comes from Tailscale, this just
// satisfies browsers' secure-context requirement. astro.config.ts auto-serves
// HTTPS (and binds all interfaces on :4321) whenever `.cert/anyip/` is present
// — gated purely on the files existing, not on this script having run. So this
// script is what flips `pnpm dev` into Tailscale/LAN mode by provisioning that
// cert; to stay localhost-only, skip the prestep AND make sure `.cert/anyip/`
// is absent (a leftover cert keeps HTTPS/all-interfaces on by itself). See
// AGENTS.md → "Remote debugging over Tailscale".
//
// The download runs through `curl` (the tool this repo has always used for it)
// rather than fetch()+writeFile: the network read and the file write both happen
// inside curl, so this process has no untrusted-network-data → fs dataflow, and
// curl honours the standard `HTTPS_PROXY`/`HTTP_PROXY` env on proxied machines.
// The URL and destinations are fixed constants and execFile takes an argv array
// (no shell), so nothing here is attacker-influenced.
import { execFile } from "node:child_process";
import { X509Certificate, createPrivateKey } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { rename, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);

const dir = new URL("../.cert/anyip/", import.meta.url);
const certPath = new URL("fullchain.pem", dir);
const keyPath = new URL("privkey.pem", dir);
// Temp targets carry a `.pem` suffix so `.gitignore`'s `*.pem` covers them too.
const certTmp = new URL("fullchain.tmp.pem", dir);
const keyTmp = new URL("privkey.tmp.pem", dir);
const SOURCE = "https://anyip.dev/cert";
const RENEW_BEFORE_MS = 7 * 24 * 60 * 60 * 1000; // renew when <7 days remain
const force = process.argv.includes("--force");

/** Cert expiry (epoch ms) when BOTH the on-disk cert and private key parse,
 *  else null. Parsing the key too means a corrupt/truncated key never passes. */
function pairExpiry() {
  try {
    if (!existsSync(certPath) || !existsSync(keyPath)) return null;
    createPrivateKey(readFileSync(keyPath)); // throws on a missing/garbled key
    return Date.parse(new X509Certificate(readFileSync(certPath)).validTo);
  } catch {
    return null;
  }
}

/** A valid pair exists and the cert hasn't expired yet — worth serving HTTPS. */
function certIsUsable() {
  const expiry = pairExpiry();
  return expiry !== null && expiry > Date.now();
}

/** Usable AND more than 7 days from expiry — no need to renew. */
function certIsFresh() {
  const expiry = pairExpiry();
  return expiry !== null && expiry - Date.now() > RENEW_BEFORE_MS;
}

/** Download one PEM to a temp path via curl. `-f` fails on HTTP >= 400 so an
 *  error page never lands on disk; the timeouts stop a stalled or half-open
 *  connection from hanging `pnpm dev` — it funnels into the catch instead. */
async function curlTo(name, tmpDest) {
  await run("curl", [
    "-fsS",
    "--connect-timeout",
    "10",
    "--max-time",
    "20",
    "--create-dirs",
    "-o",
    fileURLToPath(tmpDest),
    `${SOURCE}/${name}`,
  ]);
}

if (!force && certIsFresh()) {
  console.log("✓ anyip cert present and unexpired — HTTPS dev ready (skipping fetch)");
  process.exit(0);
}

try {
  // Download to temp files, validate, then move into place — so a partial
  // failure never leaves a half-updated or mismatched cert/key pair live.
  // allSettled (not Promise.all) so both curls finish before we touch temps.
  const settled = await Promise.allSettled([
    curlTo("fullchain.pem", certTmp),
    curlTo("privkey.pem", keyTmp),
  ]);
  const failure = settled.find((r) => r.status === "rejected");
  if (failure) throw failure.reason;

  const { validTo } = new X509Certificate(readFileSync(certTmp)); // reject a non-cert body
  createPrivateKey(readFileSync(keyTmp)); // reject a non-key body
  await Promise.all([rename(certTmp, certPath), rename(keyTmp, keyPath)]);
  console.log(
    `✓ anyip cert fetched into .cert/anyip/ (valid until ${validTo}) — dev serves HTTPS on :4321`,
  );
} catch (err) {
  // Renewal failed (offline / anyip down / stalled / bad body). Exit 0 either
  // way so the chained `astro dev` still starts. Keep the existing pair while
  // it's still *usable* (not expired) — even inside the 7-day renewal window, a
  // few valid days of HTTPS beat dropping to localhost. Only delete it when
  // unusable, so astro.config.ts falls back to localhost-only HTTP.
  await Promise.all([rm(certTmp, { force: true }), rm(keyTmp, { force: true })]);
  const reason = err instanceof Error ? err.message : String(err);
  if (certIsUsable()) {
    console.warn(`⚠ anyip cert refresh failed (${reason}); keeping the existing valid cert`);
  } else {
    await rm(dir, { recursive: true, force: true });
    console.warn(
      `⚠ anyip cert fetch failed (${reason}); removed unusable cert → dev falls back to localhost HTTP`,
    );
  }
  process.exit(0);
}
