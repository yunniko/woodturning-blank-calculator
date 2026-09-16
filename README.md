# woodturning-blank-calculator

Free, no-signup tools for woodturners: a log-to-bowl-blank yield calculator, a rough-out
wall-thickness &amp; drying-time estimator for green wood (twice-turning), and a sourced
reference chart of common turning species (hardness, shrinkage, warp tendency, dust-safety
notes). See `docs/domain-reference.md` for the sourcing behind the formulas and reference table.
Nothing is uploaded anywhere — everything runs client-side.

Part of the `svc-lab` micro-service portfolio (`E:\CLAUDE\projects\svc-lab\`). No database, no
accounts, no user data collected.

## Run locally

```
npm install --legacy-peer-deps
npm run dev
```

## Test

```
npx eslint .
npx vitest run
npm run build
npx playwright test
```

## Current state

Built, tested, and domain-expert reviewed 2026-09-16. See `HANDOVER.md` for deploy status and
`GOALS.md` for the goal this belongs to.
