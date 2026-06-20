# Copilot PR review instructions

Repo-specific review criteria, applied in addition to your defaults. Report blocking issues first.
Full criteria (source of truth): `/REVIEW.md` — **keep this file in sync with it by hand.**
This is an Astro site of bilingual (Chinese + English) science-popularization "notes" in `_notes/`.

## Blocking (must fix)

**Code (every PR):**
- **No hardcoded colors.** Use design-system tokens only (`--color-accent`, `--color-cat-1…6`,
  `--color-seq-*`, `--color-positive/negative`, surface/ink/line tokens) — no raw hex/oklch/rgb in
  components (token definitions in `src/styles/global.css` are exempt). Standard Tailwind scale utilities
  (`gap-3`, `rounded-md`) are fine; flag only arbitrary one-off values (`gap-[13px]`).
- **Theme + a11y + motion** on interactive visuals: dark mode via `data-theme` (not a `.dark` class);
  Canvas reads only literal-`oklch` tokens; everything animated honors `prefers-reduced-motion`;
  SVG/Canvas/React visuals have `role="img"` + label/`<title>` and sit in a `not-prose` wrapper.

**Notes (`_notes/**`, `_posts/**`):**
- **Citation integrity.** Every fact/number/quote traces to a real, retrievable source — no invented
  DOIs, dates, authors, studies, or stats. Quotes verbatim; a translated quote keeps the original text
  alongside. Every body figure maps to a source (no orphans). A live / interactive readout that recomputes a
  number from user input is itself a citation claim — allowed only when a rigorous closed-form formula drives
  it **and its inputs/ranges are sourced or labeled illustrative**; never wire an estimated or
  mechanism-level figure to a recomputing control (a moving number reads as *measured*).
- **No fabricated narrative.** No invented scenes/sensory detail/五感白描, no reconstructed
  dialogue/inner monologue, no composite "everyman" characters, no manufactured cliffhangers.

## Meaningful (P2)

**Code:** lightest component tier (SVG > Canvas > React); React islands default `client:visible`;
no hardcoded `.html`/era URL paths (use `src/utils/url.ts`); frontmatter valid per
`src/content.config.ts` (`title` ≤ 60, `publishDate` ISO-8601 + offset); pnpm only; don't commit
`dist/`/`.astro/`/`.vercel/`; don't edit linter configs; Gitmoji + Conventional commits. Chinese
typography: space between CJK and ASCII/numbers (except before `°`/`%`), full-width punctuation in
Chinese text.

**Notes:** follow the deep-dive teaching shape (situate → prerequisites folded into prose → intuition →
full working-model mechanism / limits → mechanism-accurate analogy → visualization that carries real
information, used generously → connect-the-dots that maps the surrounding territory → next steps); a note
never asks the reader questions. A note is a depth artifact — it builds a complete working model and may
run long to do so; **don't flag length, flag padding.** Use a narrative spine throughout, with storytelling
vignettes only where there's a real, sourced story; end on a genuine, attributed open question. Calibrate
for a first-time non-specialist reader who is also a deep finisher: no jargon dumps, no undefined acronyms,
no talking down, no process meta-notes (（已校正）/（待核实）); for walls of text, diagnose first — dense
prose needs structure, padded prose needs cuts (don't shorten dense substance). Keep English proper nouns in English; gloss unfamiliar English on first use
(`throughput（吞吐量）`); don't nest full-width parens. Mobile-first visuals; `pnpm build:site` must pass.
