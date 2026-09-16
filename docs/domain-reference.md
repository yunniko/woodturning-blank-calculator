# Domain reference — woodturning-blank-calculator

Domain-expert review (wood science + woodturning craft practice), run 2026-09-16
against `lib/bowl-blank.ts`, `lib/rough-out-drying.ts`, and
`lib/wood-species-data.ts`. **Not a rubber stamp — found 5 blocking issues**, all
fixed and re-verified (20/20 Vitest, ESLint clean, production build clean, 8/8
Playwright) before shipping.

## Sources

- USDA Forest Products Laboratory Wood Handbook, Table 4-3 (shrinkage), as
  tabulated by Woodbin's "Wood Shrinkage Table"
  (https://woodbin.com/ref/wood-shrinkage-table/), cross-checked against The
  Wood Database's per-species pages. All 14 rows matched between sources;
  Quaking Aspen confirmed directly. Retrieved 2026-09-16.
- Janka hardness: 8 Billion Trees, "Janka Wood Hardness Scale Chart"
  (https://8billiontrees.com/trees/wood-hardness-scale/); Quaking Aspen (350
  lbf) and Black Locust (1700 lbf) from The Wood Database, not in that chart.
  Retrieved 2026-09-16. Figures vary a few percent between sources depending
  on test convention — treated as representative, not exact.
- Toxicity/sensitization: The Wood Database, "Wood Allergies and Toxicity"
  (https://www.wood-database.com/wood-articles/wood-allergies-and-toxicity/).
  ACGIH A1 (confirmed human carcinogen) classification for oak and beech dust,
  and the IARC Vol. 62 sinonasal-adenocarcinoma evidence behind it, from OSHA's
  woodworking eTool and CCOHS's wood dust page.
- *Cryptostroma corticale* ("maple bark disease") hypersensitivity
  pneumonitis: Washington State DOH, PMC7819180, BCMJ.
- 10%-of-diameter rough-wall rule and 3-8 month paper-bag drying range: AAW
  forum threads ("Wall thickness for twice turned bowls", "Drying time for
  rough turned blanks", "Roughed Out Bowls - Paper Bag Drying Method") and
  Turn A Wood Bowl, "Drying Green Wood Bowls".
- Split-through-the-pith as the dominant blank-cutting method: AAW forum
  "Blanks From Logs" and Woodworkers Journal "Cutting Bowl Blanks from a
  Tree".
- 2:1-3:1 bowl diameter:height proportion: Southern Piedmont Woodturners,
  "Aspect Ratio in Woodturning" (also notes 1:2 and the golden ratio 1.618:1
  as alternatives turners use).

## Blocking issues found and fixed

1. **Drying-time guidance was keyed to the wrong variable.** The original
   `warpTendency` banding used the tangential:radial shrinkage *ratio*, which
   inverted reality for dense woods with a large absolute shrinkage spread
   (hickory) and light woods with a small one (aspen). Fixed:
   `wood-species-data.ts` now bands on `warpSpreadPct` (the absolute
   difference, `tangentialShrinkPct - radialShrinkPct`), which is the correct
   indicator for how much a green blank ovals as it dries.
2. **Drying-time range ignored wall thickness entirely** — a 4in and a 16in
   bowl got the same month range. Fixed: `rough-out-drying.ts` now keys the
   3-8 month range off `roughWallThicknessIn` only (thinner wall → shorter
   range, thicker → longer), matching what the cited sources actually
   describe. Warp spread is used only for the wall-thickness rounding-up
   note, not the drying-time estimate.
3. **Toxicity notes for 5 species were wrong or incomplete.** The most
   serious: American Beech was presented as the table's cleanest safety
   profile when beech dust is ACGIH A1 (confirmed human carcinogen), the same
   class as oak, per IARC sinonasal-adenocarcinoma evidence. Fixed: rewrote
   notes for White Ash, Yellow Birch, American Beech, White Oak, and Black
   Locust; broadened the spalted-wood hypersensitivity-pneumonitis note from
   maple-only to any spalted/moldy species.
4. **The bowl-blank model's "one disk per cross-cut, pith at center" was
   wrongly framed as the common case.** The dominant real practice is
   splitting the log through the pith first, yielding two blanks per section
   with the pith excluded — full disks with the pith intact reliably crack.
   Fixed: `lib/bowl-blank.ts`'s header comment and the `/bowl-blank-calculator`
   FAQ now give the split-through-pith method top billing and reframe the
   disk model (still the only one this calculator computes) as a narrower
   alternative for shallow platters or logs much wider than the desired
   bowl. Modeling the split method's own yield was judged out of scope for
   this pass — it depends on bandsaw layout, not arithmetic on the log's
   round dimensions — so the tool is explicit that its blank-count math
   describes the disk method only.
5. **Suggested bowl height could exceed the blank's own thickness.** Fixed:
   `calculateBowlBlanks` now clamps `suggestedHeightRangeIn` to
   `blankThicknessIn - HEIGHT_WASTE_ALLOWANCE_IN` (0.75in), and returns
   `heightLimitedByBlankThickness` so the UI can say when the cap — not the
   2:1–3:1 proportion — is the binding constraint.

## Caveat-level fixes also applied

- Quaking Aspen Janka hardness corrected (420 lbf was Bigtooth Aspen's
  figure; Quaking Aspen is 350 lbf per The Wood Database).
- `/bowl-blank-calculator` FAQ: fixed a "can ripping" grammar bug, and added
  an end-grain-sealing (Anchorseal or equivalent) FAQ entry — previously
  missing entirely.
- `/turning-wood-reference` safety paragraph: named a concrete respirator
  class (NIOSH N95 minimum; FFP2/FFP3 or a P100 half-mask for extended
  turning/sanding of oak or beech specifically) instead of "a proper dust
  mask/respirator."

## What's explicitly a rule of thumb, not a guarantee

Every number here (10% rough-wall rule, 3-8 month drying range, 2:1-3:1
proportion, wall-thickness height clamp) is a widely-repeated shop convention
from the turning community, not a physics model — the tool says so on every
page it appears, and defers to weighing the blank on a scale over any
calendar-based estimate.
