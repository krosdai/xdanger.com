---
name: note-craft
description: >-
  The canonical method for authoring or revising a published explainer NOTE for
  this site — the MDX notes under `_notes/**` (and `_posts/**`), and the
  `/note-from-issue` pipeline. Use it whenever you are researching a topic and
  writing it up as a standalone, teach-a-first-timer note, or reviewing note /
  article prose here. It is the deep-dive teaching method adapted for a
  non-interactive published artifact (prerequisites folded into prose, the note
  never asks the reader anything), with an investigative-journalism storytelling
  layer (a narrative spine throughout, vignettes where the material carries a
  real story), reader calibration for one known reader (first-time, curious,
  non-specialist, mobile-first, and a deep finisher who wants a full working
  model), visualization
  via this repo's SVG / Canvas / React component stack, bilingual term &
  typography conventions, and hard fabrication / citation guardrails. Do NOT use
  it for live interactive teaching (that is the global `deep-dive` skill) or for
  quick factual lookups.
---

# Note-Craft — writing a published explainer note for xdanger.com

This skill turns a researched topic into a **published note**: a standalone, mobile-first explainer that
teaches a curious first-timer a real working model of the subject. It is the **deep-dive** teaching method
— prerequisite mapping, layered exposition, mechanism-accurate memory hooks, a "where to go next"
trailhead — re-pointed from a live tutoring session to a **finished artifact a stranger reads on their
phone**. A **storytelling** layer runs throughout — a narrative spine that pulls the whole note — and
rises to the full craft of explanatory / investigative journalism where the material genuinely carries a
real, sourced story (real people, the history of a discovery, connecting several threads); built from
sources, with hard anti-fabrication guardrails.

> Scope: use this when drafting, structuring, or reviewing note / article prose for this repo
> (`_notes/**`, `_posts/**`, the `/note-from-issue` pipeline). For live, back-and-forth teaching in a
> chat, the global `deep-dive` skill is the right tool; for a one-line factual answer, neither is.

This file is the **single spec source** for note writing here — `REVIEW.md` §B reviews against it.

## Two things that make a note different from live teaching

The deep-dive method assumes a learner you can talk to. A note has neither a back-channel nor a known
prior level, so two rules override the live-teaching defaults everywhere below:

1. **Non-interactive.** The note never restates a prompt and **never asks the reader a question** to
   calibrate. There is no one to answer. Any prerequisite check is **folded into prose** and supplied on
   the spot (see §2). No "you've probably seen…", no Socratic quizzing, no rephrase-the-user opener.
2. **The repo, not the generic playbook, owns delivery.** Visualization, foreign-term handling, Chinese
   typography, and mobile-first layout follow this repo's design system + `AGENTS.md` (see §5, §6, and
   the self-check) — overriding the generic chat-environment guidance the deep-dive method ships with.
   Keep only the method's *judgment* principles (a visual must carry real information — teach, reveal, or
   let the reader explore; a memory hook must share the real mechanism).

## The reader — model once, then write only the artifact

You write for **one** reader in two modes. At the door they triage on a phone — one thumb-swipe from
leaving. Once let in, they read a long way and want the whole working model. Serve both, in that order:
**earn entry, then pay depth.** Model them once; never put the modeling on the page.

```
first-time 科普 reader (published note) — curious newcomer, deep finisher
Reads how: triages on mobile in the first screenful; once the opening earns it, reads a long way — like someone who picked up a great pop-science book, not a 300-word explainer
Knows: smart and curious, but a first-time, non-specialist reader of this topic
Wants: to walk away with a working model — to predict how it behaves, see why it's built this way, and know what sits around it on the map
Doesn't: the jargon, the prerequisites, why this matters to them — assume none of it
Sensitive to: jargon dumps, undefined acronyms, being talked down to, unbroken walls of text (not length itself), manufactured drama, a shallow gloss that names a concept but leaves them unable to use it
Default register: clear and confident; one idea per sentence; warm but not chatty; generous with explanation, stingy with filler
Leave unsaid: the research journey, hedging, meta-notes (（已校正）/（待核实）), "hope this helps" closers
```

Two disciplines fall out of this card and apply to every section:

- **Ship only the finished artifact.** Omission is a craft tool for **scaffolding** — cut what the reader
  can infer (some cuts are load-bearing) and everything that betrays the writing process. It is **not** a
  tool for trimming substance: never omit a mechanism detail, a worked example, or a connection the reader
  needs (see *Density, not brevity*). No process meta-notes (`（已校正）`/`（补充）`/`（待核实）`), no visible
  research journey, no hedging-as-self-protection, no "hope this helps" / "let me know" closers.
- **Earn entry, then pay depth.** The opening must earn the read against a thumb-swipe — that is what the
  storytelling moves (the `## Storytelling` section) buy you. But entry is only half the job: once the
  reader is in, every section must pay them back with real model-building, not just keep them from leaving.
  The note can — and often should — run long, the way a good pop-science chapter does. **Length is never
  the enemy; padding is.** The test for any paragraph is not "is it short?" but "does a curious first-timer
  come out of it able to predict, connect, or understand something they couldn't before?" If yes, it earns
  its place however long the note grows; if it only restates, decorates, or hedges, cut it (see *Density,
  not brevity*).
  On a phone, depth must be navigable, not a cliff: lead each section with its payoff in one plain sentence
  (a skimmer can chain those sentences and still leave with the spine), then descend into mechanism, worked
  example, and detail below it — so a newcomer can ride the surface or drop in, and never feels walled off
  or lost. The note as a whole keeps **one question alive** from first line to last (the narrative spine,
  *Storytelling*); in a long note, that through-line is the only thing between the reader and the back button.

## The method (deep-dive, written as a standalone note)

Treat these as **elements that must appear somewhere**, not a rigid template. Order and weight follow the
topic: a history note foregrounds the timeline; a mechanism note foregrounds how it works; a "why now"
note foregrounds the stakes. Use judgment.

A note built this way is **generous**. It should read like a great, story-driven popular-science *book
chapter*, not a short explainer — long is good when every paragraph adds real information. The discipline
is **density, not brevity**: expand freely along three axes — **DEPTH** (a complete working model, §3),
**BREADTH** (the interesting territory around the topic, §6), and **richer VISUALIZATION** (§5) — and cut
only padding, never substance. The one length test in this skill: a paragraph earns its place if removing
it would cost the reader a **prediction** they could otherwise make, a **connection** they'd otherwise
miss, or a **why** they'd otherwise have to guess. If removing it costs nothing, it's padding — cut it.

Breadth is not confined to §6. A historical detour, a cross-domain aside, or a why-it's-built-this-way
digression may live inside any section when it adds real information — the surrounding territory is part of
the working model, not a coda. But an in-section detour must clear the **same bar as a §6 link**: it
carries a transferable idea (not just a name), you can state the connection in one concrete sentence, and
it needs no prerequisites the note hasn't paid for. A tangent that fails this is padding, wherever it sits.
§6 is where you draw the whole map together; the rest of the note may still wander productively when each
step earns its place.

### 1. Big picture — situate it (with the real people and history)

Open by placing the topic. Two or three sentences: **what family it belongs to**, **what problem it was
invented to solve**, and **who / when** — name the real people and the era. Historical context and the
human story (人物故事) make a concept stick, but never manufacture drama: mention the actual humans and
the actual moment, nothing invented. → When that human / historical story genuinely carries the topic,
narrate it with the craft in [references/storytelling.md](references/storytelling.md).

### 2. Prerequisites — folded into prose, never a question

Name the 2–5 concepts whose comfort level changes how the topic reads — then **supply them on the spot in
prose**, because a note can't ask. Fold the calibration into a short self-serve on-ramp, then continue.
Shape:

> 这部分默认你对 **A**、**B** 有点感觉；没有也不要紧，三句话补上：A 是 …；B 是 …；有这两点就够往下读了。

If the topic genuinely has no prerequisites, skip this — don't manufacture them. But when prerequisites
*do* exist, supply them generously — a confident on-ramp is part of letting the reader in, not padding.

### 3. Main exposition — build the working model (intuition → mechanism → edge/limits)

Walk the concept in three layers, in this order:

- **Intuition** — the cleanest mental model in one sentence, then unpacked. No formalism yet.
  ("Backpropagation is just the chain rule applied to a computation graph, working right-to-left.")
- **Mechanism** — the **core of the note and usually its longest part.** Don't just list how it works;
  build it, along three sub-moves that should each appear (prose moves by default; a long mechanism may
  give each its own H3, never deeper — see "Keeping a long note navigable"):
  - **(i) The moving parts, step by step** — in enough detail that the reader could **predict the
    system's behavior in a situation the note never showed them.** This is where formalism, equations,
    code, or the step-by-step process lives.
  - **(ii) At least one worked example** — run one concrete case all the way through the mechanism
    (inputs in → trace → output). A mechanism the reader watches operate once sticks far better than one
    merely described. A worked example is a mini-story: 跟着一个真实输入走一遍流程，让读者亲眼看见机制产出结果。
    Inputs may be illustrative (clearly hypothetical), but every computed step must be **actually correct**
    (the arithmetic / logic checks out) and any number presented as a real-world value must be sourced —
    never present an invented output as if it were measured.
  - **(iii) Why it's built this way** — the design rationale: the constraint, or the failure of the naive
    alternative, that forced this shape. Narrate it as constraint → response: 先摆出它要解决的约束（the
    antagonist），再让设计一步步回应它。This is the load-bearing *why*, not just the *what* — and it must be
    sourced or clearly reasoned, never invented intent.
- **Edge / limits** — where it breaks, what it doesn't cover, and which next concept handles the gap.

Mechanism is where a note earns the reader's time — go deep here before you go broad. The test is
behavioral: a reader who finishes this section should be able to work a **new** case you never gave them.
→ Narrate the mechanism with momentum, not as a static spec; see the constraint-driven-build shape in
[references/storytelling.md](references/storytelling.md).

### 4. Memory hooks — mechanism-accurate

Give at least one analogy, mnemonic, story, or concrete-number anchor that makes the core mechanism
stick. **A bad hook is worse than none** — verify the analogy shares the actual causal mechanism, not
just the visible outcome; if you have to caveat it in three places, find a better one. Pick the flavor
that fits the concept's shape:

- **Analogies** — for mechanisms with a familiar mechanical twin
- **Mnemonics / 口诀** — for ordered lists or named entities with no derivable order
- **Stories** — for processes that unfold over time. → When the story is real history or people, narrate
  it with the craft in [references/storytelling.md](references/storytelling.md).
- **Concrete numbers** — for scales that defy intuition

See [references/memory-hooks-patterns.md](references/memory-hooks-patterns.md) for worked examples, the
mechanism-accuracy test, and the common traps.

### 5. Visualization — build it from the repo's component stack

This is a depth note — **visuals are how you make a working model vivid and explorable**, not a last
resort. Build a visual whenever it **deepens or unlocks understanding** or **lets the reader explore** the
mechanism: when it shows a process unfolding, makes a relationship spatial, lets the reader move a
parameter and watch the system respond, or carries information prose can only gesture at. The test for an
*interactive* figure (vs. a static one) is the **driver test**: the reader must **feel one relationship by
driving an input** — drag `v`, watch ½mv² quadruple *because* KE ∝ v². Name that single relationship before
building; a control that moves but reveals nothing is decoration. Welcome
**animation** (a process in motion) and **interactivity** (the reader drives an input). **One concept can
earn several linked figures** — an overview, then a zoom, then a "now watch it run" — when each one teaches
something the previous didn't. The discipline isn't fewer visuals; it's that **every visual carries real
information** — it teaches, reveals, or lets the reader explore; never decorates, never just restates the
paragraph above it. **One figure, one idea**: when a visual has more to show, build *more figures*, each
with its own idea, rather than cramming or cutting. Don't fear the effort; fear the empty figure.

When a visual earns its place, build it as a real component following this repo's contract — *not* as an
ephemeral chat artifact. Pick the layer that **fits the idea** — reach for the interactive / animated
layers freely when the idea is dynamic or explorable; among layers that fit equally, the lighter one wins
(JS cost rises down the list):

| Layer            | Where                                       | Use when                                                            |
| ---------------- | ------------------------------------------- | ------------------------------------------------------------------- |
| **animated-SVG** | `src/components/viz/*.astro`                | Geometric / coordinate figures, limited element count. Zero JS.     |
| **Canvas + JS**  | `src/components/viz/*.astro` + `<script>`   | Many points / continuous curves / per-frame recompute.              |
| **React 19**     | `src/components/interactive/*.tsx`          | State linkage across inputs, chart libraries, deep component trees. |

**Interactive figures** earn the React layer when the lesson is *felt by driving an input* (you grasp the
v² law by dragging `v`, not by reading it) — "lightest tier wins" breaks ties among layers that teach
equally well, it never demotes a state-linked lesson. Spec each control→output with its formula in the plan,
and **only a rigorous, closed-form formula may drive a live readout** — a number recomputing on every drag
reads as *measured*, so wiring a soft or mechanism-level figure to a control is a citation-integrity hit
(`REVIEW.md` §0), not styling. See the playbook for the IO spec, the honest-recompute gate, and a worked
example.

Every visual must honor the repo contract — colors from role-based **design-system tokens** (never
hardcoded), dark mode via `data-theme`, `prefers-reduced-motion` at every animated layer, `role="img"` +
label / `<title>` / `<desc>`, wrapped in `not-prose`, and **mobile-first** (no horizontal overflow, large
touch targets, no hover-only interaction). The canonical spec is `AGENTS.md` → "Interactive component
layers" and the `/design-system` page; the living style guide is `_notes/2026/0605-interactive-notes.mdx`
plus `src/components/viz/*` and `src/components/interactive/*` — copy their patterns. Doing *more* visuals
raises the bar on this contract, not lowers it: every added figure, animation, and control must still pass
tokens-only color, dark mode via `data-theme`, `prefers-reduced-motion`, a11y labels, `not-prose`, and
mobile-first. A richer note is a note with **more compliant components**, never looser ones.

See [references/visualization-playbook.md](references/visualization-playbook.md) for the
layer-decision matrix, the payload gate, and the anti-patterns.

### 6. Connect the dots — map the surrounding territory

Build the reader a **map**, not a list of pins. A first-timer's biggest blind spot is the
I-don't-know-what-I-don't-know perimeter — the adjacent ideas, the history that produced this, the
surprising places the same idea reappears. This map is a **primary payoff** for this reader, not a safety
net; it's often the part they remember and re-tell. Give it as much room as it has real content: a rich
topic earns several paragraphs or its own H3 subsections; a narrow one earns a paragraph. The test is never
length — it is whether each link transmits a **transferable idea** the reader can carry elsewhere. Travel
any of these axes:

- **Adjacent concepts** this unlocks or depends on.
- **History / lineage** — where it came from and what it replaced. When the surrounding territory *is* the
  intellectual history — the old view, the crack that broke it, the contending hypotheses — narrate it as a
  conflict-of-ideas arc ([references/storytelling.md](references/storytelling.md)), making the *question*
  the protagonist. Breadth and story become one artifact.
- **Cross-domain reappearances** — the same mechanism showing up in an unrelated field. The highest-value
  "aha."
- **The live frontier** — what's contested or moving now.

**A link earns its place** when (1) it carries a transferable idea or mechanism, not just a name — the
reader leaves understanding *why* A and B connect; (2) you can state the connection in one concrete
sentence without hand-waving (「同一套统计偏倚换个场景照样骗人」); (3) it changes how the reader sees the
topic or hands them a reusable tool. **A link dilutes** when it is a name-drop with no stated mechanism, a
listicle of loosely-associated terms, a tangent needing prerequisites the note hasn't paid for, or included
to look thorough. Tie-breaker: if I deleted this link, does the reader lose a real piece of the map, or
just a name? **Cut the names; keep the mechanisms.**

### 7. Trailhead — concrete next steps

End with two to four concrete, *checkable* next steps: a specific paper / chapter / post to **read**, a
small experiment or calculation to **try**, a known-good video / demo to **watch**. Every citation must
be real and retrievable — if you're unsure, say so. Don't pad.

## Keeping a long note navigable (long, not exhausting)

A book-length note must stay phone-friendly. Length is earned by **density**; navigability is earned by
**structure**. Use, not avoid, these:

1. **Sectioning.** Give each major beat its own **H2** with a concrete, promise-making heading. A heading
   is a contract; a reader scanning H2s on a phone should see the argument's skeleton. A long mechanism's
   separable sub-moves (the moving parts, the worked example, the why) may each take an **H3** — H3 is a
   depth **enabler**, not something to ration. **Never nest below H3**: the note's beats are H2, their
   sub-moves are H3, nothing deeper. If a section seems to want H4, it's really two sections — split it.
2. **Signposting.** At section seams, hand the reader forward in one clause: say what just landed and what
   the next section pays off. This is what makes a long read feel like momentum instead of a wall.
3. **Payoff-first, depth-below.** Lead each section with its payoff in one plain sentence (a skimmer can
   chain those and leave with the spine), then descend into mechanism and detail. A navigability
   *principle*, not a required slot — use judgment.
4. **Layered / optional deep-dives.** When a mechanism has a rigorous layer a curious reader wants but a
   first-timer can skip (a derivation, a dataset caveat, an arithmetic check), keep it on the page but mark
   it skippable — a clearly-scoped paragraph, a parenthetical, or a captioned table — so the reader chooses
   their depth without losing the thread. **Never hide load-bearing mechanism in an optional layer.**
5. **A visual as a rest stop.** A figure is never added *for* pacing — it must earn its place on payload
   (§5). But among figures that all earn their place, *space* them through the note rather than clustering,
   so the eye also rests. Pacing is a placement rule, never a justification to build.
6. **Mobile check.** Re-read at a narrow width: no H2 should run more than a few thumb-swipes of unbroken
   prose without a figure, sub-head, table, or signpost. Diagnose before you fix — if the prose is **dense**,
   it needs **structure** (sub-head, signpost, figure); if it's **padded**, it needs **cuts**.

## Storytelling — the spine of the whole note

一篇 note 不是把若干知识点摆在一起，而是一条线串起来的旅程。整篇都该有一根**叙事脊柱（narrative
spine）**：一个贯穿全文的问题或张力，开头抛出、层层推进、结尾才真正合拢——让读者像追一本书的章节那样被
带着往下走。这不是把故事「加」到说明文上，而是让说明文本身有方向感。两层结构：

1. **A note-wide spine** every note has — one question / tension the note answers, opened early, not fully
   resolved until the end. Even a pure definitional explainer needs a shape (a question it answers); 这是
   propulsion，不是 drama。
2. **Story vignettes** (人物 / 历史 / object's-journey) used **where the material genuinely supplies sourced
   concretes** — the high-grip moments on the spine, not the spine itself.

**Narrative sequencing is always on; manufactured drama is always off.** You can — and should — narrate a
how-to or a mechanism (the question as protagonist, the constraint as antagonist); you may *not* inflate
false stakes onto mundane material, invent scenes, or withhold an answer you already have (guardrails below).

The one principle: **keep the journalism skeleton, swap the camera for the citation.** The grip comes
from the architecture of the explanation and from real disagreements between people and ideas — never
from invented atmosphere. Prefer the safe leads (a surprising sourced fact, an intuition-reframe, a real
conflict-of-ideas) and end on a genuine, attributed **open question the field itself hasn't answered**.

This layer has **hard guardrails** that double as the blocking review lines (see the self-check and
`REVIEW.md` §0): no invented scenes / sensory color / 五感白描，no reconstructed dialogue or inner
monologue, no composite "everyman" characters, no manufactured cliffhanger that withholds a known answer,
and total citation integrity. The full palette, structural templates, sourcing tiers, and the
publish-blocking self-audit live in [references/storytelling.md](references/storytelling.md).

## Bilingual prose & terminology

Notes are bilingual (Chinese narrative, English for technical terms and proper nouns). Default to Chinese
for explanation; switch to English for terms, quotes, and proper nouns. Mixing within a paragraph is
fine and natural.

- **Proper nouns stay in their native form.** Products / brands / people / tech keep their English
  (GitHub, Astro, oklch) — don't force-translate. Two exceptions: ① Chinese-native companies / orgs stay
  Chinese with English in parens on first mention — `台积电（TSMC）`, `联发科（MediaTek）`; ② people with
  an established Chinese transliteration stay Chinese (马斯克，库克).
- **First-mention term pairing.** Give both languages the first time a technical term appears —
  `反向传播（backpropagation）`; subsequent mentions can use either. Gloss an acronym once:
  `CNN（convolutional neural network, 卷积神经网络）`.
- **Gloss unfamiliar English in reading order.** When an English word a reader might not know first
  appears — including in a visual's caption — append a short Chinese gloss there, e.g.
  `throughput（吞吐量）`. Gloss at the **earliest** appearance, not a later one; don't re-gloss; skip
  words already common in Chinese tech-speak.
- **Don't nest same-width parentheses.** Avoid `（…（…）…）`. Inside a full-width-paren context, use a
  parallel form (`联电 UMC`) or a dash instead.
- **Never translate** code, math symbols, file paths, library / function names.

See [references/bilingual-conventions.md](references/bilingual-conventions.md) for the full format rules
and worked examples.

## Density, not brevity — cut padding, keep substance

A depth-edition note runs long — and that's correct when every paragraph adds real information. **Length is
never the enemy; padding and low density are.** Cut only what fails the earned-length test above — things
that add no prediction, connection, or *why*:

- Any restatement of the topic prompt or the issue it came from
- Hedging and throat-clearing ("this is a great question", "as you may know")
- Restatement and filler — the same point made twice, sentences that announce what the next sentence will
  say, transitions that carry no information
- Process meta-notes and visible research journey (`（已校正）` / `（待核实）` / `（补充）`)
- "Hope this helps! Let me know…" closers
- Markdown overhead that adds no structure (don't bold every other word; don't bullet single sentences)

Do **not** cut for length:

- a mechanism detail that changes what the reader can predict;
- a worked example that lets the reader watch the mechanism run;
- the why-it's-built-this-way;
- an adjacent idea or piece of history that helps the reader build the map (§6);
- a visual that beats prose, or one of a linked sequence (§5).

When unsure whether a substantive paragraph belongs, **apply the test, don't default**: does removing it
cost the reader a prediction, a connection, or a *why*? If you genuinely can't tell, the paragraph is
probably restating — tighten it until its unique contribution is obvious, or cut it. Judge by
information-per-paragraph, never by character count: a long note with zero padding is a success; a short
note padded with restatement is not. Do not cite a length as evidence of either virtue or vice.

## Self-check before opening the PR

This list mirrors `REVIEW.md` §0/§B — the same bar a reviewer will apply. A **blocking** hit must be
fixed before merge.

**Blocking**

- **Citation integrity.** Every fact, number, and quote traces to a real, retrievable source actually
  consulted — no invented or guessed DOIs, dates, authors, titles, or statistics. Quotes are verbatim; a
  translated quote keeps the original-language text alongside. Every body figure maps to a source (a
  来源/Methods entry or inline citation) — no orphans.
- **No fabricated narrative.** No invented scenes / sensory color / 五感白描 over unsourced detail; no
  reconstructed dialogue or inner monologue; no composite "everyman" characters; no manufactured
  cliffhanger withholding a known answer. Drama comes from real sourced facts and real disagreements.

**Meaningful**

- **Structure** present and in standalone form: situated big picture (with real people/history) →
  prerequisites folded into prose (never a question) → intuition → a **full working-model mechanism**
  (predictive detail + ≥1 worked example + why-it's-built-this-way) → edge/limits → ≥1 mechanism-accurate
  memory hook → **visualization that deepens or unlocks understanding** (animation and interactivity
  welcome; multiple linked figures welcome; each figure carries one idea, none decorates or restates
  prose) → **connect-the-dots that maps the surrounding territory** (adjacent ideas / history / tangents as
  transferable-idea links, not a name list) → trailhead of concrete next steps.
- **Sourcing depth.** Tier evidence (peer-reviewed > preprint > reputable outlet > press release); prefer
  reviews / meta-analyses for "consensus" claims; flag preliminary / single-study / industry-funded
  claims; when sources conflict, report the spread and attribute each side; for any scale comparison,
  show the arithmetic and sanity-check the order of magnitude.
- **Reader calibration.** No jargon dumps, no undefined acronyms, no talking down, no manufactured drama.
  Walls of unbroken text are a defect — but diagnose first: **dense** prose needs **structure**
  (sectioning, signposting, skippable deep-dives, paced visuals), **padded** prose needs **cuts** — never
  shorten dense substance. The reverse failure counts too: no shallow gloss that names a concept without
  giving the reader a usable model. A clean finished artifact — no process meta-notes, no
  visible research journey, no closers.
- **Density, not brevity.** The note may run long; what it may not do is pad. Every paragraph adds real
  information — a prediction, a connection, or a *why*. The note carries a **narrative spine** (one question
  alive across sections; mechanism and breadth narrated, not listed). Judge by information-per-paragraph,
  never by total length: a long dense note passes; a short padded one does not. (Manufactured drama and
  false stakes remain blocking per the guardrails above.)
- **Bilingual / terminology & typography.** Per the rules above; plus space between CJK and ASCII /
  numbers (except before `°`/`%`), full-width punctuation in Chinese paragraphs and half-width in
  English. Respect AutoCorrect's fixes.
- **Delivery.** Visuals follow the repo's design-system / theme / a11y / motion contract — role-based
  color tokens only (no hardcoded color), Canvas reads only literal-oklch tokens — and are mobile-first
  (no horizontal overflow, large touch targets, no hover-only); frontmatter valid (`title` ≤ 60,
  `publishDate` ISO-8601 with offset) and the filename → URL convention holds; `pnpm build:site` passes.

## Reference files

- [references/storytelling.md](references/storytelling.md) — the narrative layer: the note-wide spine
  (every note) plus the vignette craft for story-shaped parts (人物 / 历史 / connect-the-dots) —
  investigative / explanatory-journalism moves for a writer working from sources, with the publish-blocking
  fabrication guardrails.
- [references/memory-hooks-patterns.md](references/memory-hooks-patterns.md) — analogies, mnemonics,
  stories, numbers: when to use which, the mechanism-accuracy test, and the common traps.
- [references/visualization-playbook.md](references/visualization-playbook.md) — choosing among the
  repo's SVG / Canvas / React layers, the payload gate (does it deepen or unlock understanding), building
  linked multi-figure sequences, the design-system / a11y / motion contract, and the anti-patterns.
- [references/bilingual-conventions.md](references/bilingual-conventions.md) — Chinese / English term
  pairing, glossing, proper-noun handling, and typography format rules.
