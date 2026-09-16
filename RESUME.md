# Resume point — woodturning-blank-calculator

**Session budget ran out mid-fix, right after applying the first (data) fix from the
domain-expert review.** Do NOT push, deploy, or claim tests pass — the tree is currently
**broken** (a renamed field) and unverified. Resume here before starting anything new.

## What happened

Built all 3 tools (bowl blank calculator, rough-out/drying calculator, species reference
chart), full suite was green (ESLint clean, 18/18 Vitest, build clean 7 routes, 8/8
Playwright) — then a domain-expert review (woodturning/wood-science) found **5 blocking
issues**, not a rubber stamp. Full review text is in this run's task-notification; a
condensed version needs to become `docs/domain-reference.md` (not yet written).

## Blocking issues found (fix ALL before shipping)

1. **`lib/rough-out-drying.ts` drying-time/warp guidance was keyed to the wrong variable**
   (T/R ratio instead of absolute T-R difference) and inverted reality for hickory (called
   "stays round, thinner wall OK" — it's actually one of the densest/slowest-drying woods
   here) and aspen (called "warps more" — it's actually low-density and dries fast). Drying
   time must be driven by wall thickness (the function already computes this and ignores
   it) + a density signal, NOT by warp tendency.
2. Same file: drying-time estimate **ignores `roughWallThicknessIn`** entirely — a 4in and
   a 16in bowl get identical month ranges. Fix: key the range off thickness (dominant
   variable per the review), not species.
3. **`lib/wood-species-data.ts` toxicity notes for White Ash, Yellow Birch, American
   Beech, Black Locust, White Oak were wrong/incomplete** — FIXED in this session (see
   below). American Beech was the serious one: it's ACGIH A1 (confirmed human carcinogen,
   same as oak) and was being presented as the *cleanest* profile in the table.
4. **`lib/bowl-blank.ts`'s "one blank per cross-cut disk, pith at center" model is NOT the
   common/default real-world method** — the dominant documented practice is: crosscut a
   section slightly longer than the desired blank diameter, **split it through the pith**,
   bandsaw a round blank from each half (2 blanks per section, pith excluded). Full
   cross-sectional disks with the pith intact reliably crack (this is in the drying-crack
   literature, not folklore). NOT YET FIXED — needs either (a) a real model of the split
   method, or (b) at minimum, stop calling the disk method "the common case" and give the
   split method top billing with a clear qualitative explanation, and keep the disk method
   as an explicitly-labeled alternative for shallow platters / very wide logs only.
5. **Suggested bowl height range can exceed the blank thickness the user specified** (no
   clamp against `blankThicknessIn`). NOT YET FIXED — clamp `suggestedHeightRangeIn` to
   `blankThicknessIn` minus a small tenon/waste allowance (e.g. 0.75-1in), and show a note
   if the diameter-based proportion range doesn't fit the blank.

## What was already fixed this session (data-only, in `lib/wood-species-data.ts`)

- Renamed `trRatio` → `warpSpreadPct` (= `tangentialShrinkPct - radialShrinkPct`, an
  absolute difference, not a ratio) and rebanded `warpTendency` off the new variable
  (thresholds: ≤3.0 Lower, 3.0-4.5 Moderate, >4.5 Higher). **This is a breaking rename —
  every other file that referenced `.trRatio` now has a type error and must be updated.**
- Fixed the Quaking Aspen Janka hardness (was 420 lbf — that's Bigtooth Aspen's figure;
  correct Quaking Aspen figure from The Wood Database is 350 lbf).
- Rewrote toxicity notes for White Ash, Yellow Birch, American Beech (the critical one —
  now correctly flagged as ACGIH A1 carcinogen, same class as oak), White Oak, Black
  Locust, American Sycamore, Quaking Aspen, American Basswood, Shagbark Hickory, and
  broadened the spalted-wood hypersensitivity-pneumonitis note (was maple-only, now says
  it applies to any spalted/moldy species).
- Updated the file's header comment to cite the domain review and explain the ratio→
  difference correction and the carcinogen-classification addition.

## What is now BROKEN and needs fixing next, in order

1. **Grep for every remaining reference to `.trRatio`** (a full-repo grep timed out last —
   scope it to `lib/`, `app/`, `tests/` only, not the whole project root, to avoid
   `node_modules`). Known call sites from memory (verify, don't trust blindly):
   - `lib/rough-out-drying.ts` — uses `species.warpTendency`/`species.trRatio` in
     `warpNote` and in picking `dryingRangeMonths`. Needs a full rewrite of the drying-time
     logic per blocking issues 1-2 above (key off `roughWallThicknessIn`, not species/warp),
     and the warp-note text should switch to `species.warpSpreadPct` (fine to keep using
     warp spread for the *wall-thickness* nudge — just not for drying time).
   - `tests/unit/rough-out-drying.test.ts` — references `beech.trRatio` in an assertion;
     rename to `warpSpreadPct`, and the "higher warp tendency -> longer drying" test
     assumption needs to change entirely since drying time no longer depends on species.
   - `tests/unit/wood-species-data.test.ts` — the "computes the T/R ratio consistently"
     test needs to become a "computes warpSpreadPct consistently" test (subtraction, not
     division), and the warp-tendency banding-threshold test needs the new thresholds.
   - `app/_components/rough-out-tool.tsx` — `estimateRoughOut` call and result display;
     check if it references `.trRatio` anywhere in copy.
   - `app/turning-wood-reference/page.tsx` — table column header "T/R ratio" and
     `row.trRatio` cell need to become "Warp spread (pp)" and `row.warpSpreadPct`.
2. Rewrite `lib/rough-out-drying.ts`: drying-time range as a function of
   `roughWallThicknessIn` only (e.g. thinner wall → shorter range, thicker → longer),
   dropping the species-based month adjustment per the review's own suggested honest
   alternative ("stop varying drying time by species... present the flat range with
   'denser species and thicker walls take longer' as text" if you don't want to add real
   density data). Keep species-based guidance only for the wall-thickness *rounding-up*
   advice (using `warpSpreadPct`), not for the month range.
3. Fix `lib/bowl-blank.ts` (blocking issues 4 and 5) — see above. This is the biggest
   remaining piece of work; budget more time for it than the others.
4. Update `app/bowl-blank-calculator/page.tsx` FAQ: stop calling the disk method "the
   common case"; give the split-through-pith method top billing; fix the "can ripping"
   grammar bug (line with "An experienced turner can ripping extra blanks"); add a
   green-blank-storage/end-sealing (Anchorseal or equivalent) note — currently missing
   entirely.
5. Update `app/turning-wood-reference/page.tsx`'s safety paragraph: name a concrete
   respirator class (NIOSH N95 minimum, FFP2/FFP3 or a P100 half-mask better for extended
   turning/sanding of oak or beech specifically) instead of just "a proper dust
   mask/respirator" — the review called this too vague to act on, and this is exactly the
   page listing the carcinogen notes.
6. Re-run the full suite from scratch: `npx eslint .`, `npx vitest run`, `npm run build`,
   `npx playwright test`. Do not trust the pre-review green run — the interfaces changed.
7. Only then: write `docs/domain-reference.md` (condensing the review's findings + sources
   + what was fixed), run the manual security checklist, `git init`/commit, push via
   `init-repo.ps1`, deploy via `deploy-service.ps1` (port 30270 chosen, not yet
   live-verified free), SEO review, hub update. None of this has happened yet.

## Port / naming already decided

- Project dir: `E:\CLAUDE\projects\woodturning-blank-calculator`
- Deploy port: 30270 (container 3000); local dev/test port used by `playwright.config.ts`:
  30271. Neither verified free on the host yet — `deploy-service.ps1` re-verifies live
  regardless.
- Backlog idea #49 in `svc-lab/GOALS.md` — already added, marked "Building now", NOT yet
  marked Shipped. Ideas #50-78 (this run's other 29 researched-and-rejected niches) already
  logged too — that part is done and doesn't need revisiting.

## Sources to preserve (for `docs/domain-reference.md`, not yet written)

- USDA FPL Wood Handbook Table 4-3 (shrinkage), confirmed directly for Quaking Aspen via
  The Wood Database, other 13 species matched by recall — a future session should spot
  confirm a couple more if time allows.
- ACGIH A1 carcinogen classification for oak and beech dust; IARC Vol. 62 sinonasal
  adenocarcinoma evidence; OSHA woodworking eTool; CCOHS wood dust page.
- *Cryptostroma corticale* ("maple bark disease") hypersensitivity pneumonitis: WA State
  DOH, PMC7819180, BCMJ.
- AAW forum "Blanks From Logs" and Woodworkers Journal "Cutting Bowl Blanks from a Tree"
  for the split-through-pith method being the dominant practice.
- 10%-of-diameter rough wall rule: confirmed standard (AAW forum). Paper-bag drying:
  ~4 months in-bag after initial daily changes, 6-8 months total to reach ≤10% MC (AAW
  forum threads, Turn A Wood Bowl).
- 2:1-3:1 bowl diameter:height proportion: confirmed fair (Southern Piedmont Woodturners,
  "Aspect Ratio in Woodturning" — also cites 1:2 and the golden ratio 1.618:1 as
  alternatives turners use).
