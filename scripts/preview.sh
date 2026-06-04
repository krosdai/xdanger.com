#!/usr/bin/env sh
# Serve the built dist/ with `serve` (cleanUrls:false, see serve.json) so local
# preview matches production hosting 1:1 — unlike `astro preview`, which layers on
# routing magic. Mirrors `pnpm dev`'s anyip gating: with the anyip cert present
# (run `pnpm cert:anyip`), serve HTTPS on all interfaces — reachable over Tailscale
# at https://<dashed-ip>.anyip.dev:4321. Without it, plain HTTP on localhost only,
# so the preview is never exposed to the LAN without TLS.
#
# `-c ../serve.json`: serve resolves the config path relative to the served dir
# (dist/), so this points at the repo-root serve.json.
set -e

cert=.cert/anyip/fullchain.pem
key=.cert/anyip/privkey.pem

if [ -f "$cert" ] && [ -f "$key" ]; then
  echo "🔒 HTTPS on all interfaces — open https://<dashed-tailscale-ip>.anyip.dev:4321 (tailscale ip -4)"
  exec pnpm dlx serve dist -l 4321 -c ../serve.json --ssl-cert "$cert" --ssl-key "$key" --no-port-switching
else
  echo "🌐 HTTP on localhost — http://localhost:4321  (run \`pnpm cert:anyip\` for HTTPS over Tailscale)"
  exec pnpm dlx serve dist -l tcp://127.0.0.1:4321 -c ../serve.json --no-port-switching
fi
