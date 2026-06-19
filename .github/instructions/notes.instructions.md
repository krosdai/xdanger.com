---
applyTo: "_notes/**,_posts/**"
---

# Note / article review (Copilot)

These files are bilingual (Chinese + English) science-popularization notes. Review writing quality, not
just code. Full criteria: `/REVIEW.md` §B (keep in sync). A note should teach a first-time,
curious-but-unfamiliar reader.

## Blocking

- **Citation integrity.** Every fact, number, and quote traces to a real, retrievable source. No
  invented/guessed DOIs, dates, authors, study titles, or statistics. Quotes verbatim; a translated
  quote keeps the original-language text alongside. Every body figure → a source (no orphans). A live /
  interactive readout that recomputes a number from user input is itself a citation claim — allowed only
  when a rigorous closed-form formula drives it (½mv², unit conversions); never wire an estimated or
  mechanism-level figure to a recomputing control (a moving number reads as *measured*).
- **No fabricated narrative.** No invented scenes, sensory color, or 五感白描 over unsourced detail; no
  reconstructed dialogue or inner monologue; no composite / "everyman" characters; no manufactured
  cliffhanger that withholds a known answer. Drama from real sourced facts, not invented atmosphere.

## Meaningful (P2)

- **Deep-dive structure** (standalone published note): situate the topic incl. real people/history →
  prerequisites folded into prose (never ask the reader) → intuition → a **full working-model mechanism**
  (predictive detail + ≥1 worked example + why-it's-built-this-way) → edge/limits → at least one
  **mechanism-accurate** memory hook (shares the real mechanism, not just the outcome) → **visualization
  used generously to make the model vivid**, each figure one clear idea (many focused figures preferred
  over cramped or too-few; animation / interactivity welcome) → **connect-the-dots that maps the
  surrounding territory** (transferable-idea links, not a name list) → trailhead of concrete next steps.
- **Storytelling** — a narrative **spine** runs through every note (one question alive across sections);
  full **vignettes** (history/people/connect-the-dots) only where the material supplies sourced concretes.
  Prefer a surprising sourced fact, an intuition-reframe, or a real conflict-of-ideas as the lead; end
  on a genuine, attributed open question rather than a forced moral or false summary.
- **Sourcing depth:** tier evidence (peer-reviewed > preprint > reputable outlet > press release); prefer
  reviews/meta-analyses for "consensus" claims; flag preliminary / single-study / industry-funded claims;
  when sources conflict, report the spread and attribute; for scale comparisons, show the arithmetic and
  sanity-check the order of magnitude.
- **Reader calibration:** no jargon dumps, no undefined acronyms, no talking down, no manufactured drama.
  Walls of unbroken text are a defect — but diagnose first: **dense** prose needs **structure**, **padded**
  prose needs **cuts** — don't shorten dense substance; a shallow gloss that names a concept without a
  usable model fails too. Clean finished artifact — no process meta-notes (（已校正）/（补充）/（待核实）), no "hope this
  helps" closers, no visible research journey.
- **Depth & density:** the note should build a **complete working model** and may run long to do so —
  reward depth, breadth (the surrounding territory, mapped), and a narrative spine. **Don't flag length;
  flag padding** (restatement, hedging, filler that adds no prediction / connection / why). A long dense
  note passes; a short padded one does not.
- **Bilingual / terminology:** keep English proper nouns in English; Chinese-native company names stay
  Chinese with English in parens on first mention (台积电（TSMC）); gloss unfamiliar English at first
  appearance (`throughput（吞吐量）`); don't nest full-width parens (use `联电 UMC` or a dash).
- **Typography:** space between CJK and ASCII/numbers except before `°`/`%`; full-width punctuation in
  Chinese paragraphs.
- **Delivery:** mobile-first visuals (no horizontal overflow, large touch targets, no hover-only);
  frontmatter valid (`title` ≤ 60, `publishDate` ISO-8601 + offset); `pnpm build:site` passes.
