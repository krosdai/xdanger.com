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
pnpm build          # production build (also runs pagefind post-build)
pnpm preview        # preview production build
pnpm lint           # autocorrect + prettier --check + eslint + astro check
pnpm fix            # autocorrect + prettier --write + eslint --fix
```

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

The site preserves three URL conventions for backward compatibility — see `README.md`'s
"URL 规则" section. Treat `src/utils/url.ts` (`getBlogEra`, `getPostPath`) as the source of
truth when adding new content.

1. **MoveableType era** (publish date < `2013-05-31`): `/YYYY/MM/DD/SEQ.html`
2. **Jekyll era** (`2013-05-31` ≤ date < `2025-02-28`): `/YYYY/MM/DD/title.html`
3. **Astro era** (date ≥ `2025-02-28`): `/YYYY/MMDD-title` (no `.html`)

`vercel.json` has `cleanUrls: true`, so the new era posts serve from `.html` files but are
accessed without the suffix.

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
- Don't bypass `cleanUrls` or hard-code `.html` in new internal links — use the helpers in
  `src/utils/url.ts`.
- Don't commit `dist/`, `.astro/`, or `.vercel/` artifacts.

## Notes on Chinese typography

- Insert a space between CJK and ASCII / numbers (e.g., `使用 Astro 6`), except for `°` and `%`.
- CJK paragraphs use full-width punctuation; English paragraphs use half-width.
- AutoCorrect enforces most of this automatically; respect its fixes.
