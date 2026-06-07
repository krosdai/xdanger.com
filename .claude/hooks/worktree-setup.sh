#!/usr/bin/env bash
# Install dependencies when a Claude Code session starts inside a git worktree.
# Fresh worktrees have no node_modules (it's gitignored), so deps must be linked
# before any work begins. Wired to the SessionStart hook in .claude/settings.json.
# Defensive: bails quietly so the hook never errors, even when install fails.
set -uo pipefail

# Use the project root Claude exposes to hooks (same source start-preview.sh uses).
# No jq/stdin parsing, so the hook works on machines without jq. Fall back to cwd.
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$PWD}"

# Only act inside a worktree; do nothing for the main checkout.
case "$PROJECT_DIR" in
  */.claude/worktrees/*) ;;
  *) exit 0 ;;
esac

# Need pnpm available; bail quietly otherwise so the hook never errors.
command -v pnpm >/dev/null 2>&1 || exit 0
cd "$PROJECT_DIR" 2>/dev/null || exit 0

# Install against the committed lockfile so the worktree matches the repo state.
# pnpm output goes to stderr (kept out of model context). A failed install must
# never surface as a hook error and interrupt session startup — so swallow it.
pnpm install --frozen-lockfile >&2 || exit 0

# Deps now exist. Launch the preview server here: start-preview.sh defers inside
# worktrees (it would otherwise race ahead and fail before node_modules existed),
# so we hand it the go-ahead. Idempotent — it no-ops if the server is already up.
PREVIEW="$(dirname "${BASH_SOURCE[0]}")/start-preview.sh"
[ -x "$PREVIEW" ] && WORKTREE_SETUP_DONE=1 "$PREVIEW" >&2 || true

exit 0
