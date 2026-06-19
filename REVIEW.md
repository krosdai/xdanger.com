# REVIEW.md — PR review standards for this repo

**For AI reviewers (Claude, Codex, Copilot, Greptile) and humans.** Apply these repo-specific criteria
**in addition to** your normal review. This file is the single source of truth; it links to the full
specs rather than restating them.

**Severities.** **Blocking** = must fix before merge (Claude/Copilot: P1; Codex: P0/P1). **P2** =
meaningful, worth raising. Skip pure nits. Lead with the blocking red lines below — if your output is
capped, spend it there.

**Scope.** The **Code** rules (§A) apply to every PR. The **Article / note** rules (§B) apply only when
the PR touches `_notes/**` or `_posts/**`.

---

## 0. Blocking red lines (check these first)

**Articles / notes** (when `_notes/**` or `_posts/**` changes):

- **Citation integrity.** Every fact, number, and quote must trace to a real, retrievable source. No
  invented or guessed DOIs, dates, authors, study titles, or statistics. Quotes are verbatim; a
  translated quote keeps the original-language text alongside it. Every figure/number in the body maps to
  a source (a 来源/Methods entry or inline citation) — no orphans. **A live / interactive readout that
  recomputes a number from user input is itself a citation claim** — a moving number reads as *measured*, so
  it's allowed only when a rigorous, closed-form formula derives it and its inputs/ranges are sourced
  (½mv², compound interest, unit conversions). Estimated, fudged, or mechanism-level quantities must **not**
  drive a live numeric readout — keep them qualitative (direction / relative size) or freeze them as a
  single sourced callout with the arithmetic shown.
- **No fabricated narrative detail.** No invented scenes, sensory color, or 五感白描 over unsourced
  detail; no reconstructed dialogue or inner monologue ("she must have felt…"); no composite / "everyman"
  characters (e.g. 想象一下武汉的张医生…); no manufactured cliffhanger that withholds an answer the writer
  already has. Drama comes from real, sourced facts and real disagreements — not invented atmosphere.

**Code** (every PR):

- **No hardcoded colors.** Use role-based design-system tokens (`--color-accent`, `--color-cat-1…6`,
  `--color-seq-*`, `--color-positive/negative`, surface/ink/line tokens). No raw hex/oklch/rgb in
  components. The one exception is the token *definitions* in `src/styles/global.css` (and theme config),
  where literal `oklch` values are expected.
- **Theme + a11y + motion contract** on interactive visuals. Dark mode via `data-theme` (not a `.dark`
  class); Canvas reads only tokens that are literal `oklch` in both themes; everything animated honors
  `prefers-reduced-motion`; SVG/Canvas/React visuals carry `role="img"` + label/`<title>`/`<desc>` (or
  labeled controls), and sit in a `not-prose` wrapper.

---

## A. Code review criteria (all PRs)

Full spec: [`AGENTS.md`](./AGENTS.md) — flag deviations from it.

- **Interactive component layers.** Use the lightest tier that does the job: **SVG** (animated, zero JS) >
  **Canvas + JS** (many points / continuous curves) > **React** (state linkage, chart libs, deep trees).
  `.astro` viz import from `@/components/viz/` with no client directive; React islands default to
  `client:visible` (`client:load` only if above-the-fold and immediately interactive); chart libraries
  installed on demand, not preinstalled.
- **Design-system tokens.** Colours come from role-based tokens (see §0) — flag only genuinely
  hardcoded colours, not the token definitions or Tailwind colour utilities that map to them. For
  spacing/radius/motion, the standard Tailwind scale utilities (`gap-3`, `py-5`, `rounded-md`,
  `transition-colors`) are the house style and are fine; flag only arbitrary one-off values (e.g.
  `gap-[13px]`, inline `margin: 13px`) or raw values in custom CSS that bypass `--space-*`/`--radius-*`/
  `--dur-*`/`--ease-*`. The design-system page + `src/styles/global.css` are the source.
- **Theme / motion / a11y** (see §0): `data-theme`, `currentColor`/`var(--color-*)` for SVG, Canvas reads
  literal-oklch tokens via `getComputedStyle` and reacts to a `MutationObserver` on `data-theme`, scales
  for `devicePixelRatio`, cleans up rAF/observers in `disconnectedCallback`; `prefers-reduced-motion`
  honoured at every layer; `not-prose` wrapper around visuals.
- **Chinese typography.** Space between CJK and ASCII/numbers (e.g. `使用 Astro 6`), except before
  `°`/`%`; full-width punctuation in Chinese paragraphs, half-width in English; respect AutoCorrect's
  fixes (don't fight them).
- **URLs & frontmatter.** Don't hardcode `.html` or era-specific paths — use `src/utils/url.ts` helpers.
  Notes are `_notes/<YYYY>/<MMDD>-<slug>.mdx` → `/notes/<slug>-<YYYYMMDD>`. Frontmatter
  (`src/content.config.ts`): `title` ≤ 60 chars, `description` (optional for notes), `publishDate` =
  ISO-8601 with offset.
- **Build / lint / tooling.** pnpm only (no npm/yarn/bun). `pnpm fix` + `pnpm lint` + `pnpm build:site`
  must pass. Don't commit `dist/`, `.astro/`, or `.vercel/`. Don't modify linter/formatter configs
  without explicit approval. Don't reintroduce `bun`/`biomejs`/`deno` or `cleanUrls`.
- **Commits.** Gitmoji + Conventional Commits; subject ≤ 50 chars, imperative, why-not-what; unrelated
  changes split.

---

## B. Article / note review criteria (`_notes/**`, `_posts/**`)

Full spec: the project skill [`note-craft`](./.agents/skills/note-craft/SKILL.md) under
[`.agents/skills/`](./.agents/skills/) (also surfaced to Claude Code via a symlink in `.claude/skills/`) —
the repo's canonical note-writing method (deep-dive teaching structure adapted for a standalone published
note, reader calibration, and an investigative-journalism
[`storytelling`](./.agents/skills/note-craft/references/storytelling.md) overlay). The note pipeline is
`/note-from-issue` (see [`.claude/commands/note-from-issue.md`](./.claude/commands/note-from-issue.md)).

A note should teach a first-time, curious-but-unfamiliar reader who is also a deep finisher — using the
**deep-dive** method, carried by a narrative **spine** throughout, with full investigative-journalism
**storytelling vignettes** where the material carries a real, sourced story.

- **Deep-dive structure** (adapted for a standalone published note): a big picture that situates
  the topic (incl. the real people/history); prerequisites **folded into prose** (a note never asks the
  reader questions); layered exposition (intuition → a **full working-model mechanism**: predictive detail
  + ≥1 worked example + why-it's-built-this-way → edge/limits); at least one **mechanism-accurate** memory
  hook (an analogy must share the actual mechanism, not just the outcome); **visualization used generously
  to make the working model vivid**, each figure carrying one clear idea (many focused figures preferred
  over few cramped or too-few; animation and interactivity welcome); **connect-the-dots that maps the
  surrounding territory** (adjacent ideas / history / tangents as transferable-idea links, not a name
  list); a trailhead of concrete next steps.
- **Storytelling** — a narrative **spine** runs through every note (one question alive across sections);
  full **vignettes** (人物 / 历史 / connect-the-dots) only where the material supplies sourced concretes.
  The blocking guardrails in §0 apply throughout. Prefer safe leads (a surprising sourced fact; an
  intuition-reframe; a real conflict-of-ideas) and an honest-uncertainty ending on a genuine, attributed
  open question.
- **Sourcing quality** (beyond the §0 blockers): tier evidence (peer-reviewed > preprint > reputable
  outlet > press release) and prefer reviews/meta-analyses for "consensus" claims; flag preliminary /
  single-study / industry-funded claims; when sources conflict, report the spread and attribute each
  side; for any scale comparison, show the arithmetic and sanity-check the order of magnitude.
- **Reader calibration** (note-craft, "first-time 科普 reader, deep finisher"): no jargon dumps or
  undefined acronyms, no talking down, no manufactured drama. Walls of unbroken text are a defect — but
  diagnose first: **dense** prose needs **structure** (sectioning, signposting, skippable deep-dives, paced
  visuals), **padded** prose needs **cuts** — don't shorten dense substance. The reverse also fails: a
  shallow gloss that names a concept without giving a usable model. Ship a clean
  finished artifact — no process meta-notes (（已校正）/（补充）/（待核实）), no "hope this helps" closers,
  no visible research journey.
- **Depth & density (depth edition).** The note should build a **complete working model** and may run long
  to do so — reward depth (mechanism detailed enough to predict behavior, worked examples,
  why-it's-built-this-way), breadth (the surrounding territory, mapped), and a narrative spine (one question
  alive across sections; mechanism and breadth narrated, not listed). **Do not flag a note for length; flag
  it for padding** — restatement, hedging, scaffolding, filler that adds no prediction / connection / why.
  A long dense note passes; a short padded one does not.
- **Bilingual / terminology.** Keep English proper nouns (products/brands/people/tech) in English;
  Chinese-native company names stay Chinese with English in parens on first mention (台积电（TSMC）);
  gloss unfamiliar English at first appearance (`throughput（吞吐量）`); don't nest full-width parens —
  use a parallel form (`联电 UMC`) or a dash.
- **Delivery.** Mobile-first, responsive visuals that follow §A's design-system / a11y / motion contract;
  no horizontal overflow, touch targets large enough, no hover-only interactions; frontmatter & URL valid
  per §A; `pnpm build:site` passes.

---

*Keep this file authoritative and in sync with `AGENTS.md` and the skills it links. The Copilot
instruction files under `.github/` are a deliberate short copy of the highest-priority rules here —
update them together.*
