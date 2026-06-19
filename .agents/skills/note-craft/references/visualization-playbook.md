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

**The driver test (decides interactive vs. static).** An interactive island earns its weight only when the
single insight is **felt by driving an input** — the reader changes a value and a _live-derived_ output
moves with it, and the *moving* is the lesson (drag `v` → ½mv² quadruples, *because* KE ∝ v²). Apply it
both ways: when manipulation is how the relationship lands, the React island **is the fitting tier, not an
indulgence** — "lightest tier wins" breaks ties among layers that teach equally well, it never demotes a
state-linked lesson to a static picture. But when a static or animated SVG already shows the relationship, a
knob that re-renders the same takeaway is **decoration** — stay static. Name the one relationship the
manipulation reveals *before you build*; if you can't, you don't have an interactive figure yet.

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

## Spec the IO before you build (interactive only)

Once the driver test says "interactive," write the input→output contract down *before* writing the
component — it's the difference between a toy and a teaching instrument:

- **Inputs.** Each control: what it varies, its range, its default, its step. Choose ranges that span the
  *interesting* regime (where the relationship visibly bends), not arbitrary round numbers. Label every
  control (it's both an a11y requirement and a comprehension one).
- **Outputs.** Each live readout: the exact expression that derives it from the inputs, its units, and its
  rounding. Write the formula in the component's header comment so a reviewer can check it.
- **The one relationship.** State the single law the reader should feel by dragging (e.g. "KE scales with
  the *square* of speed but only linearly with mass"). If two controls don't jointly serve one relationship,
  you have two figures, not one.

### The honest-live-recompute gate

A number that **recomputes on every drag reads as *measured*.** That is a strong, often subconscious claim
of precision — so a live readout is held to the same bar as a cited figure (see `REVIEW.md` §0,
citation integrity), not to the bar of decorative chrome. Before wiring any number to a control:

- **Only a rigorous, closed-form formula may drive a live readout.** ½mv², mv, compound interest, unit
  conversions — exact relationships whose inputs you also expose. The reader can check your arithmetic by
  hand; that's the point.
- **Never wire an estimate, a fudge factor, or a mechanism-level quantity to a live number.** If the honest
  answer is "it depends / roughly / order-of-magnitude," a digit that updates 60×/second lies about its own
  certainty. Keep that payload **qualitative** (show *direction* and *relative size* — a bar that grows, a
  band the output crosses into) or freeze it as a single sourced callout with the arithmetic shown.
- **Anchor live outputs to a _checkable_ reference, not to invented precision.** A live KE bar is honest
  *because* it sits beside a reference the reader can trust — either **cited**, or **derived in the prose
  from the same formula** (e.g. a ~95–165 kJ "real car crash" bracket = that same ½mv² for a ~1 t car at
  ~50–65 km/h). The reader reads *"a heavy horse at the gallop lands in car-crash territory,"* not a
  spurious exact joule count presented as fact. A reference you _label_ "sourced" but never cite or derive is
  itself an orphan — the gate applies to the comparison too, not just the live number.

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
- **Interactive islands** (React, driven inputs): controls are **controlled** React state (value + setter,
  never an uncontrolled DOM input), live outputs derive via `useMemo` from that state, and the lesson works
  on **tap** — no hover-only reveal. Labels, touch-target size, and overflow are already covered by the
  a11y and Mobile-first sections — don't re-litigate them, just satisfy them. **One island, one insight:** if
  it's teaching two relationships, split it.
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

**"Why does *charge speed* matter so much more than the horse's *weight*?"**
→ **React** `interactive/*.tsx`. The lesson is the *asymmetry* (KE ∝ v² vs. ∝ m), and it only lands when the
reader drags both sliders and watches speed move the energy bar far more violently than mass does — that's
the driver test passing. IO spec: `speed` 10–45 km/h and `mass` 400–800 kg sliders → a live `½mv²` bar (a
rigorous closed-form formula, so a live number is honest) shown *against a reader-checkable ~95–165 kJ
car-crash bracket* (the same ½mv² for a ~1 t car at ~50–65 km/h, **derived in the prose** — not an asserted
external stat). Keep the *force-concentration* point — why a couched lance hurts more than the same energy
spread over a body — **out of the live readout**: leave it to prose (or at most a toggle that shows only the
*direction* of the effect), because a precise contact pressure is a mechanism-level estimate, not a
closed-form fact (honest-recompute gate). This is exactly what the shipped `CavalryShockEnergy.tsx` does.

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
- **A control that moves but reveals no relationship** — interactivity with no named insight is decoration
  with extra JS. If dragging the slider doesn't make the reader *feel* one relationship, cut the control and
  ship a static figure (fails the driver test).
- **A live readout recomputing a soft number** — wiring an estimate or a mechanism-level quantity to a
  control so it re-derives on every drag (e.g. a cavalry widget printing a precise *矛尖压强* live, when the
  honest payload is the force-concentration *principle*, not a spot pressure). A moving number reads as
  *measured*; an over-precise one is a citation-integrity hit, not a style nit. Keep the principle and drop
  the live digits, or freeze the number as a single sourced callout (see the honest-live-recompute gate).
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
