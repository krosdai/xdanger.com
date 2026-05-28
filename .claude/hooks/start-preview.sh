#!/usr/bin/env bash
# Auto-start the Astro dev server so Claude Code's Preview panel has something to show.
# Wired to the SessionStart hook in .claude/settings.json.
# Idempotent: if port 4321 is already serving, this does nothing.
set -uo pipefail

PORT=4321
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
LOG_FILE="${TMPDIR:-/tmp}/astro-dev-preview.log"

# Already serving? Don't spawn a second server.
if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  exit 0
fi

# Need pnpm available; bail quietly otherwise so the hook never errors.
command -v pnpm >/dev/null 2>&1 || exit 0
cd "$PROJECT_DIR" 2>/dev/null || exit 0

# Launch detached so the hook returns immediately and the server outlives it.
nohup pnpm dev >"$LOG_FILE" 2>&1 &
disown 2>/dev/null || true

exit 0
