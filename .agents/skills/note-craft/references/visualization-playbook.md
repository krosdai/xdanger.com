# Visualization Playbook (for notes)

Reference for putting a visual in a note. The `SKILL.md` body already lists the three layers and the
contract; **consult this file when you're on the boundary between two layers**, or need the worked
decisions and anti-patterns. A visual in a note is a real component on the page — built, themed, and
shipped — not an ephemeral chat artifact.

## The gate: does this deepen or unlock understanding?

Build visuals **generously** — the depth edition wants the working model made vivid and explorable, and the
reader who came to go deep rewards the effort. The bar is **payload, not scarcity**: a visual must carry
something a paragraph can't, or carry it better. Before building, pass all three:

1. **It teaches something.** Name the single thing the reader walks away seeing, feeling, or able to do.
   **One figure, one idea** — if a figure is trying to say three things, **split it into three figures**;
   don't cram, and don't cut the content. A figure that just re-renders the bullet list above it is
   decoration — fix it (annotate the steps, animate the transition, let the reader vary an input) or cut it.
2. **Reach for motion and interactivity when the idea is dynamic or explorable.** A process that unfolds
   wants animation; a system with a knob wants a control the reader can drag. Don't default to static out
   of timidity.
3. **It survives mobile.** The site's readers are mostly on phones; the contract below is non-negotiable at
   every layer.

A built component is the **default** for any mechanism, process, or relationship worth a working model. Use
prose, a Markdown table, or a number callout only when the *content shape* genuinely is a comparison or a
single magnitude (see the layer table) — choose it on fit, not to avoid building.

### Multiple linked figures are good

A rich concept often deserves a **sequence**: an overview figure to orient, a zoomed / annotated figure for
the mechanism, a "watch it run" or "try it yourself" figure for the dynamics. Link them in the prose so the
reader builds one model across them. The style guide note `0605-interactive-notes.mdx` stacks seven-plus
figures across one theme — **that is the texture to aim for, not the exception to avoid.**

## Layer decision — match the layer to the shape of the idea

Match the layer to the **shape of the idea** (the table below). JS cost rises down the list, so among
layers that fit equally well, prefer the lighter — but never downgrade an interactive or animated idea to a
static figure just to save JS. **Fit beats thrift.**

| Content shape                                                                                  | Layer            | Where                                       |
| --------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------- |
| Comparison across ≥3 items × ≥3 attributes                                                    | **Markdown table** | inline in the `.mdx`                       |
| Magnitude / scale that defies intuition                                                        | **Number callout** | inline prose                              |
| Geometric / coordinate figure, relationship, process, limited element count (static or animated) | **animated-SVG** | `src/components/viz/*.astro` (zero JS)      |
| Many points / continuous curves / per-frame recompute (waveforms, particles, fields)          | **Canvas + JS**  | `src/components/viz/*.astro` + `<script>`   |
| State linkage across inputs, chart libraries, deep component trees                             | **React 19**     | `src/components/interactive/*.tsx`          |

- A relationship / hierarchy / process you can draw with a handful of nodes → an **SVG** figure (it
  recolors with the theme for free; see below). Keep a single SVG to roughly a dozen elements for
  legibility; when a concept is richer, split it into a **linked sequence** of figures (overview → detail →
  dynamics) rather than one crowded diagram — multiple clear figures beat one busy one. Don't reach for
  Canvas or React for something static.
- "Watch it run" dynamics (a curve redrawing as a parameter moves, a field animating) → **Canvas**.
- Only escalate to **React** when there's genuine cross-input state, a chart library, or a deep tree.
  Chart libraries (recharts / visx / d3) are installed **on demand**, not preinstalled.

## The contract — every visual must satisfy it

Pulled from `AGENTS.md` → "Interactive component layers" and `REVIEW.md` §0/§A. A visual that violates
any of these is **blocking** at review.

- **Tokens, never hardcoded color.** Colors come from role-based design-system tokens — `--color-accent`
  (primary / single series / links), categorical `--color-cat-1…6` (multi-series, stable across themes),
  sequential `--color-seq-*` (magnitude / rank), `--color-positive` / `--color-negative` (gain / loss).
  Spacing / radius / motion use `--space-*` / `--radius-*` / `--dur-*` / `--ease-*`. No raw hex / oklch /
  rgb in components.
- **Theme.** Dark mode is `data-theme="dark"` on `<html>` — **not** a `.dark` class, and never
  `--chart-*`.
  - **SVG**: stroke / fill with `currentColor` + `var(--color-*)` → recolors with zero JS.
  - **Canvas**: colors don't auto-update. Read them via
    `getComputedStyle(document.documentElement).getPropertyValue('--color-…')`, and **only** read tokens
    that are literal `oklch` in both themes (`--color-accent`, `--color-accent-2`, `--color-link`,
    `--color-quote`, the `--color-cat-1…6` and `--color-seq-*` ramps). React to switches with a
    `MutationObserver` on `data-theme`; scale for `devicePixelRatio`; clean up rAF / observers in
    `disconnectedCallback`.
  - **React**: prefer Tailwind utilities (`text-accent`, `bg-accent`, `text-foreground/70`); they flip
    via the `dark:` variant mapped to `data-theme`.
- **Reduced motion.** Every animated layer honors `prefers-reduced-motion: reduce` — SVG / Canvas via
  `@media (prefers-reduced-motion: no-preference)` (or draw one static frame); React via `motion-safe:` /
  `motion-reduce:`.
- **a11y.** SVG: `role="img"` + `<title>` / `<desc>` (or `aria-label`). Canvas: `role="img"` +
  `aria-label` + fallback text inside `<canvas>`. React: label every control (`useId()` + `<label
  htmlFor>`); mark purely decorative visuals `aria-hidden`.
- **`not-prose`.** Wrap visuals so the typography plugin doesn't restyle them (the demo components wrap
  themselves).
- **Import & client directives** (in `.mdx`): `.astro` (SVG, Canvas) take **no** client directive; React
  islands default to **`client:visible`** (`client:load` only if above the fold and immediately
  interactive).

## Mobile-first (non-negotiable for this site)

- No horizontal overflow at narrow widths; the figure reflows or scales, it doesn't force a sideways
  scroll.
- Touch targets large enough; no hover-only interactions (there is no hover on a phone) — every control
  works on tap.
- Degrade gracefully on small screens: a dense desktop chart may need a simpler mobile form. Build for
  the phone first, then let it scale up.
- Self-check the note in a narrow viewport before shipping.

## Pacing visuals through a long note

In a depth note, figures double as **rest stops**. A figure is never built *for* pacing — it must earn its
place on payload (the gate above). But among figures that all earn their place, **space** them through the
note rather than clustering — a long H2 with no figure, table, or sub-head is a structure smell (see
`SKILL.md` "Keeping a long note navigable"). More figures means more *compliant* components, never looser
ones: every added figure re-runs the full contract above.

## Worked decisions

**"How does a transformer process a sequence?"**
→ An **SVG** `viz/*.astro` figure: token → embedding → [attention → add&norm → FFN] × N. Static
architecture, limited nodes, recolors with the theme for free. No JS, no React.

**"What does the normal distribution look like as σ changes?"**
→ **Canvas** `viz/*.astro` with one labeled control redrawing the PDF — a continuous curve recomputed
per frame. Honor reduced-motion by drawing the σ-default frame statically.

**"Compare Postgres, MySQL, and SQLite for a small read-heavy app."**
→ A **Markdown table** (3 items × ~6 attributes). No component needed.

**"How much energy is 150 MW, really?"**
→ A **number callout** in prose with the arithmetic shown and both inputs cited. Magnitude is the point;
a chart would add nothing.

**"Several inputs that interact (rate, term, contribution) feeding one result."**
→ **React** `interactive/*.tsx`, `client:visible`, Tailwind theme utilities, every input labeled. This
is the case that justifies the heaviest layer.

**"How does diffusion turn noise into an image?"**
→ A **linked sequence**, because one figure can't hold the whole model: (1) an **SVG** strip showing the
forward noising schedule (static, annotated steps); (2) a **Canvas** figure animating one reverse
denoising step as the curve sharpens per frame; (3) a **React** island letting the reader drag the step
count and watch sample quality change. Each figure teaches a distinct beat; the prose threads them into one
model. This is the depth-note default for a genuinely multi-stage mechanism — not over-building.

## Anti-patterns

- **A figure that restates the bullet list above it** — keep one.
- **Reaching for React when SVG / Canvas would do** — heavier and slower for the same outcome; and React
  for something static is pure overhead.
- **Hardcoded color / `--chart-*` / a `.dark` class** — breaks theming; blocking at review.
- **Hover-only interaction or a desktop-only layout** — fails the site's mobile-first readers.
- **Pie charts for > 5 slices** (humans can't compare angles — use a bar chart); **3D charts** (the third
  dimension distorts); **color-only encoding** (pair with shape / pattern / label).
- **Decorative motion** — animating something that isn't changing, or motion that carries no information,
  just delays comprehension. Animate a *process* (a curve redrawing as a parameter moves, a flow
  propagating, a state transition); don't animate a label drifting in. Motion is welcome when it shows
  change; cut it when it shows nothing.
- **Decoration emoji / chartjunk** — noise, not information.

## Reference implementation

The living style guide is `_notes/2026/0605-interactive-notes.mdx` together with the demo components in
`src/components/viz/*` and `src/components/interactive/*`. Copy their patterns — theme linkage, the
custom-element Canvas lifecycle, reduced-motion handling, and the a11y wiring are already correct there.
