# Storytelling Overlay — narrating the narrative parts

This is the **secondary** craft layer for a deep-dive: the pedagogical method in `SKILL.md` is the
spine, and you reach for this file only where a part of the topic genuinely *carries a story* — the real
human story (人物故事), the historical arc of a discovery (历史故事), or the connect-the-dots that links
several threads into one picture. It is the craft of deep, investigative/explanatory journalism, adapted
for a writer who works **from sources, not from first-hand reporting**.

Use it on a section, not the whole piece. A definitional explainer or a how-to needs no story — forcing
one manufactures false stakes (see guardrails). When the material *is* story-shaped, this layer makes it
grip.

## The one principle: keep the skeleton, swap the camera for the citation

The grip of great explanatory/investigative journalism is **engineering, not ineffable voice**. (Ed
Yong: "99 percent of writing problems are actually structuring problems… most of the techniques are
fairly obvious on the page and easy to reverse-engineer.") The high-leverage devices all operate on
**verifiable ideas, history, numbers, and published claims** — so they are simultaneously high-impact
*and* low fabrication-risk. The drama comes from the **architecture of the explanation** and from **real
disagreements between people and ideas**, never from invented atmosphere.

Operating rule: any device that wants a concrete particular must be fed a **sourced** one — a date, a
named person doing a documented thing, a measured number, a real verbatim quote. When no sourced
concrete exists, **drop one rung to honest summary rather than invent.** A reporter earns scene and
texture first-hand; you do not have that, so you trade the camera for the citation. (This is the same
discipline as the mechanism-accuracy test for analogies in `memory-hooks-patterns.md` — never let a
vivid surface stand in for a verified mechanism.)

## Safe narrative moves — the palette

Pick what fits the part. These are the moves that survive the no-first-hand-reporting constraint.

- **Surprising-fact / vivid-summary lead** — open the section on a real, cited, counterintuitive fact.
  The default safe hook. (The cancer-screening note's "a screening that looked like a miracle was a
  statistical illusion" is this move.)
- **Intuition-reframe** — name the reader's naive model in one line, then overturn it. ("It's intuitive
  to think antibodies protect you — but immunology is where intuition goes to die.") Reproducible from
  verifiable claims; conveys nuance instead of false certainty.
- **Conflict-of-ideas / discovery-as-narrative** — make the *question* the protagonist, not a person
  whose feelings you'd have to imagine. Sequence the real intellectual history: the old/intuitive view →
  the crack that broke it → the contending hypotheses → the decisive evidence → what is still open. Every
  beat is a documented position, date, or paper. The withheld answer supplies the suspense.
- **Ladder of abstraction** (shared with the spine) — open a narrative section on the concrete particular,
  earn the abstraction, then oscillate. Concrete-first is also fabrication-safe when the concrete is
  sourced.
- **Full-circle kicker** — close the loop on the opening image with a single held-back, cited fact. The
  reserved "gold coin" lands hardest at the end.
- **Honest-uncertainty ending on a real open question** — end on a question *the field itself* has not
  answered, with the uncertainty attributed. This is the genuine version of "leaving suspense." (The
  swiss-verein note's "the biggest variable in the next decade may hide in the tightening tension between
  Swiss arbitration and EU law" is this move.)
- **Gold coins + section transitions** — seed cited, counterintuitive facts (a scale comparison, a named
  first/record) to pull the reader forward. **Bright line:** a section may end on an open question *only
  if the next section answers it from a source*; never end on withholding a fact you already have (that is
  a manufactured cliffhanger — see guardrails).

## Structural templates — when a whole note is story-shaped

If the topic (not just a section) is a story, pick a shape:

- **Explainer** (question → answer → why-it-matters) — the *default* for an abstract "what is X / why
  now" topic with no real anecdote; near-zero fabrication temptation. Often you want this and only a
  *touch* of the moves above.
- **Discovery / conflict-of-ideas arc** (complication → developments → resolution) — a real documented
  dispute or the history of a discovery.
- **WSJ feature** (sourced specific → nut graf → body → full-circle kicker) — when a real, citable
  concrete instance exists to open on. The opening specific must be lifted from a source; if none exists,
  fall back to the surprising-fact lead.
- **Follow-one-thread / object's journey** — trace a sprawling system (a supply chain, a metabolic
  pathway, the internet) through one real representative entity.
- **Hourglass** (top-line facts → turn → chronological narrative) — serves skimmers and engaged readers
  at once when there's both a bottom line and a story worth telling in order.
- **Problem → solution** — "how are people tackling X"; avoid both doom-only and hype-only.

## Hard guardrails — the final self-audit gate

Run this list against the finished draft. **Any hit blocks publish.** These exist because the failure
modes of "narrative" writing are exactly the moves a sourced writer must not make.

- **No invented scenes / sensory color / 五感白描** over unsourced detail (weather, gestures, mood, "you
  can almost smell it"). Absent sourced sensory detail → honest summary ("they worked in a poorly
  ventilated shed"), not a manufactured scene.
- **No reconstructed dialogue or inner monologue** ("she must have felt…", "he thought…"). Only verbatim,
  attributable quotes from published interviews / talks / papers. If a person's words or motive can't be
  sourced, fall back to the discovery arc.
- **No composite / "everyman" characters** ("想象一下武汉的张医生那天早上…"). Only real, documented
  carriers (a named case, a specific study, a real object); if none exists, use an analogy instead.
- **No manufactured cliffhanger** that withholds a known answer ("但接下来发生的事改变了一切"). Allowed
  only: questions the *field* has not answered, attributed. Test: *do I actually know the answer I'm
  hiding?* If yes, reveal it or end elsewhere.
- **No purple prose / evaluative adjectives** (惊人地，触目惊心，令人发指) doing the work a cited number
  should do. Cut the adjective, supply the figure; let the restrained register carry the weight.
- **No vague / unquantified stakes** ("this changes everything"); **no question lead as a crutch** ("你有
  没有想过…"); **no false-summary / forced-moral tail** ("这告诉我们…", "归根结底…"). The prior concrete
  or open beat is the true kicker — delete the explainer-of-the-meaning sentence.
- **No analogy that smuggles a false implication** (agentive/teleological framing the sources don't
  support; an un-fenced metaphor readers over-extend). Mark where the metaphor breaks; one analogy per
  concept.

### When writing from sources / for publication

These are the rules most specific to building a note from web research — and citation integrity is the
**single most likely fabrication vector for an LLM**, more so than invented scenes.

- **Citation integrity.** Cite **only sources you actually retrieved this session.** Never invent a DOI,
  a date, a "2021 study," or attach a real author to a claim they did not make. Quote **verbatim** from
  the fetched text; when you translate a quote, **preserve the original-language quote alongside** the
  translation. No figure appears in the body without a session-retrieved source behind it, and **every
  body figure maps to a 来源/Methods entry** (no orphans).
- **Evidence tiering.** Not all citations are equal: peer-reviewed > preprint > reputable outlet > press
  release / blog. Prefer reviews / meta-analyses for any "consensus" claim; explicitly flag preliminary,
  single-study, or industry-funded claims.
- **Source disagreement.** When sources conflict on a fact, report the spread and attribute each side —
  don't silently pick one or average them.
- **Numeracy sanity.** For any "concretize the scale" comparison (e.g. "150 MW ≈ 120,000 households"),
  show the arithmetic, cite both inputs, and sanity-check the order of magnitude before publishing.
- **When NOT to dramatize.** If the section's one-sentence theme has no real stakes, write it plainly and
  say so. Don't inflate false stakes onto a mundane topic; the gravity of "narrative" pulls that way.

## What good looks like

The strongest existing notes already do this without naming it: the cancer-screening note opens
surprising-fact + intuition-reframe and ends on what evidence still can't settle; the chips note is a
pure conflict-of-ideas ("everyone self-designs — yet they all flow through one fab"); the swiss-verein
note closes on a genuine, attributed open question. If a strong note seems to "violate" a rule here, the
rule is wrong — fix the rule, not the note.
