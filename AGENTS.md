# Agent Guide — xdanger.com

This file is the canonical instructions for any AI coding agent (Claude Code, Codex, Cursor,
etc.) working in this repository.

## Tech stack

- **Framework**: [Astro](https://astro.build/) v6 (static output)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`), `@tailwindcss/typography`
- **Content**: MDX in `_posts/` and `_notes/`
- **Search**: Pagefind (built post-build)
- **Runtime**: Node.js ≥ 20.19 (use Node 22 LTS locally; see `.nvmrc`)
- **Hosting**: Vercel (static) + GitHub Pages workflow as backup

## Toolchain

| Concern        | Tool                                                |
| -------------- | --------------------------------------------------- |
| Package mgr    | **pnpm** (≥ 10). Do NOT use `npm`, `yarn`, or `bun` |
| TS/JS linter   | **ESLint** (flat config, `eslint.config.js`)        |
| Formatter      | **Prettier** (`.prettierrc.json`)                   |
| CJK text lint  | **AutoCorrect** (`.autocorrectrc`)                  |
| Markdown lint  | `markdownlint-cli2` (run on demand for `.mdx`)      |
| Type checker   | `astro check` (uses `tsconfig.json`)                |

### Commands

```bash
pnpm install        # install deps
pnpm dev            # local dev server
pnpm cert:anyip     # fetch anyip TLS cert so `pnpm dev` serves HTTPS (Tailscale remote debug)
pnpm build          # production build, including pagefind search index
pnpm build:site     # Astro-only build for faster local rebuild checks
pnpm build:debug    # Astro build with NODE_OPTIONS=--trace-warnings
pnpm run rebuild        # Astro-only rebuild; reuse cached OG image PNG and fill missing ones
pnpm run rebuild:og     # force-refresh all OG image PNG in the local cache
pnpm preview        # serve dist/ via scripts/preview-server.mjs — faithful prod static mirror (try_files $uri $uri/index.html =404); do NOT use `astro preview` for URL checks
pnpm lint           # autocorrect + prettier --check + eslint + astro check
pnpm fix            # autocorrect + prettier --write + eslint --fix
```

### Remote debugging over Tailscale

`pnpm dev` auto-serves **HTTPS** when an [anyip.dev](https://anyip.dev) wildcard cert is present
in `.cert/anyip/`, making the dev server reachable from any device on the tailnet with a
browser-trusted TLS cert (handy for mobile / secure-context testing). Without the cert it falls
back to plain HTTP on localhost, so the default local flow is unchanged.

```bash
# One-time; re-run ~every 90 days when the cert expires. Saves into .cert/anyip/ (git-ignored).
pnpm cert:anyip
```

Then run `pnpm dev` and open `https://<dashed-ip>.anyip.dev:4321`, where `<dashed-ip>` is this
machine's Tailscale IP with dots written as dashes — look it up with `tailscale ip -4` (e.g.
`100.77.4.5` → `100-77-4-5`). HMR works over the same port with no extra config. The mechanism
(anyip resolves the embedded IP back, plus a Let's Encrypt wildcard cert for `*.anyip.dev` whose
private key is intentionally public) is documented in the note atop `astro.config.ts`.

> **Heads-up:** with the cert present the dev server binds to all interfaces (`0.0.0.0`), so it's
> reachable not only over Tailscale but on any LAN the machine is attached to — enable it only on
> networks you trust, or add a firewall rule. Without the cert, `pnpm dev` stays on `localhost`.

### File-level checks

When you edit a file by hand, run the appropriate checks before committing:

- `.astro`, `.tsx`, `.ts`, `.mjs`, `.jsx`, `.js`, `.json`, `.mdx`:
  ```bash
  pnpm exec prettier --write <file> && pnpm exec eslint --fix <file> && pnpm exec autocorrect --fix <file>
  ```
- `.mdx`:
  ```bash
  pnpm exec markdownlint-cli2 --fix <file>
  ```

## Repository layout

```
_posts/               # Blog posts (MDX)
_notes/               # Notes (MDX)
public/               # Static assets served as-is
src/
  assets/             # Imported assets (optimized by Astro)
  components/         # Astro components
  content.config.ts   # Content collections schema (zod via astro/zod)
  data/               # Static JSON/TS data
  env.d.ts            # Ambient types
  layouts/            # Page layouts
  pages/              # Routes (file-based)
  plugins/            # Custom remark/rehype plugins
  site.config.ts      # Site-wide config (title, url, fonts, expressive-code)
  styles/             # Global CSS, including Tailwind entry
  utils/              # Helpers (url, date, etc.)
astro.config.ts       # Astro config (integrations, fonts, markdown pipeline)
tailwind.config.ts    # Tailwind config (mainly for typography plugin)
eslint.config.js      # ESLint flat config
.prettierrc.json      # Prettier config
.autocorrectrc        # AutoCorrect config
```

## URL formats

The site uses **clean URLs by default, with the frozen legacy posts as the exception** — see
`README.md`'s "URL 规则" section. Treat `src/utils/url.ts` (`getPostPath`, `getPostRouteSlug`,
`getCanonicalUrl`, `getNotePath`) as the single source of truth when adding content.

1. **MoveableType era** (publish date < `2013-05-31`): `/YYYY/MM/DD/SEQ.html`
2. **Jekyll era** (`2013-05-31` ≤ date < `2025-02-28`): `/YYYY/MM/DD/title.html`
3. **Astro era** (date ≥ `2025-02-28`): `/title-YYYYMMDD` (clean, no `.html`); slug comes from the
   filename after `MMDD-`, date from the `YYYY`+`MMDD` prefix. The briefly-used `/YYYY/MMDD-title`
   form (and the older `/YYYY/MMDD-title.html`) redirect here — see the redirect mechanism below.
4. **Notes**: file `_notes/<YYYY>/<MMDD>-<slug>.md` (year-foldered, date-prefixed; mirrors the
   Astro-era post layout) → URL `/notes/<slug>-<YYYYMMDD>`. The date comes from the path, so it is
   timezone-independent; a filename that doesn't match the convention fails the build.

Mechanism: `build.format: "directory"` outputs every page as `<path>/index.html` (clean URLs); the
`legacyHtmlFlattener` integration (`astro:build:done` in `astro.config.ts`) then flattens the
historical posts (①②) back to flat `<path>.html` files. Redirects are two-layer: `astro.config.ts`'s
`redirects` bakes a `canonical`+`noindex` **meta-refresh stub** (200 HTML) into the static output as a
portable fallback for any static host (e.g. GitHub Pages), while `vercel.json`'s `redirects` upgrades the
same sources to true **308** permanent redirects on Vercel. Keep the two source/destination sets in sync.
`pnpm preview` reads `vercel.json`'s `redirects`, so it reproduces Vercel's 308s 1:1.

## Commit style

Conventional Commits + Gitmoji (see `.cursor/rules/git-commit.mdc`):

```
<gitmoji> <type>(<scope>)[!]: <subject>

- :emoji: change description
```

- Gitmoji: ✨feat 🐛fix 📝docs ♻️refactor ✅test 🔧chore
- Subject: ≤ 50 chars, lowercase imperative, no period, backtick code refs
- Focus on **why**, not **what**
- Split unrelated changes into separate commits

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds via `withastro/action@v3` (which
auto-detects pnpm from the lockfile) and deploys to GitHub Pages. Vercel is configured via
`vercel.json` for the canonical site at `xdanger.com`.

## Things to avoid

- Don't touch linter/formatter configs without explicit approval.
- Don't reintroduce `bun`, `biomejs`, or `deno` tooling — they were intentionally removed.
- Don't reintroduce `cleanUrls` or hard-code `.html`/era-specific paths in internal links — use
  the helpers in `src/utils/url.ts`.
- Don't commit `dist/`, `.astro/`, or `.vercel/` artifacts.

## Notes on Chinese typography

- Insert a space between CJK and ASCII / numbers (e.g., `使用 Astro 6`), except for `°` and `%`.
- CJK paragraphs use full-width punctuation; English paragraphs use half-width.
- AutoCorrect enforces most of this automatically; respect its fixes.
