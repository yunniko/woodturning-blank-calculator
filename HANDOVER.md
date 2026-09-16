# Handover — woodturning-blank-calculator

Last verified: 2026-09-16 at (not yet committed — see below)

## Current state

Three tools, all client-side, no server routes, no accounts/database:
- `/bowl-blank-calculator` — log → bowl-blank yield, max bowl diameter, suggested height range.
- `/rough-out-drying-calculator` — rough-turn wall thickness + paper-bag drying-time range.
- `/turning-wood-reference` — 14-species sourced reference chart (shrinkage, Janka hardness,
  warp spread, toxicity/dust-safety notes).

Verified this session: ESLint clean, 20/20 Vitest, production build clean (7 routes:
`/`, `/_not-found`, `/bowl-blank-calculator`, `/robots.txt`, `/rough-out-drying-calculator`,
`/sitemap.xml`, `/turning-wood-reference`), 8/8 Playwright. Manual security checklist clean:
no server routes needing auth, no `.env`/secrets present, `.gitignore` covers `.env*`, only the
shared `lib/json-ld.tsx` helper uses `dangerouslySetInnerHTML` (with `JSON.stringify`-escaped
input), no uploads/eval/dynamic `import()` of user-controlled paths.

**Not yet shipped.** This session resumed a prior run's `BLOCKED: session budget` state (see
`RESUME.md`, now stale/completed) and fixed all 5 blocking issues a domain-expert review found —
see `docs/domain-reference.md` and `docs/decisions/D001`. Still to do before shipping: `git init`
+ commit, push via `init-repo.ps1`, deploy via `deploy-service.ps1` (port 30270 chosen, not yet
live-verified free), SEO review, hub-page (`julienika-home`) link.

## How things fit together

- Formulas/reference data live in `lib/bowl-blank.ts`, `lib/rough-out-drying.ts`,
  `lib/wood-species-data.ts` — each has a header comment citing sources and the domain review's
  corrections. UI components in `app/_components/*.tsx` are thin wrappers around these pure
  functions; pages under `app/*/page.tsx` hold SEO metadata + FAQ copy.
- `wood-species-data.ts` computes `warpSpreadPct` (tangential − radial shrinkage, NOT a ratio)
  and bands it into `warpTendency`. `rough-out-drying.ts`'s drying-time range depends only on
  `roughWallThicknessIn`, not species — species only affects the wall-thickness rounding-up note.
- `bowl-blank.ts`'s `calculateBowlBlanks` models one blank per cross-cut disk (pith at center) —
  the FAQ on `/bowl-blank-calculator` is explicit that the more common real-world method (split
  through the pith first, ~2 blanks per section) isn't what this tool computes.

## Rules in force

- Don't revert `warpSpreadPct` to a tangential:radial ratio, and don't re-couple drying time to
  species — both were real bugs a domain review caught (D001).
- Don't call the disk/pith-center blank model "the common case" in any copy — it isn't.
- `suggestedHeightRangeIn` must stay clamped to blank thickness; don't remove
  `heightLimitedByBlankThickness` without also removing the UI note that depends on it.
- `npm install`/`npm ci` need `--legacy-peer-deps` (portfolio-wide npm/arborist bug, not specific
  to this project).

## Next steps and open questions

- Ship: `git init`, repo-local `user.email`, commit, push via `init-repo.ps1`; deploy via
  `deploy-service.ps1` (port 30270); SEO review; hub-page + sitemap-index link in
  `julienika-home`, redeployed.
- **COMPANY-doc reconciliation needed** (per the automation's standing note — this session may
  not edit `COMPANY\**`): add `woodturning-blank-calculator` to
  `COMPANY\INFRASTRUCTURE_DEPLOY.md`'s port registry (`127.0.0.1:30270`, no DB, domain
  `woodturning-blank-calculator.svc.julienika.cz`) and `COMPANY\GOALS.md`'s project index.
- `RESUME.md` is now stale (all blocking fixes applied and re-verified) — delete once shipped;
  `rm` has been blocked in this automation's sandbox on every prior service, so it may need a
  future session to remove.

## Deploy log

| Date | Commit | What changed | How verified |
|------|--------|---------------|---------------|
| — | — | not yet deployed | — |

## Decisions

See `docs/decisions/README.md` and `docs/decisions/D001-domain-review-model-fixes.md`.
