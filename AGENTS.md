# woodturning-blank-calculator — project conventions

Read `HANDOVER.md` first: current state, decision record, next steps. Goal in `GOALS.md` (G-001).
Parent initiative in `E:\CLAUDE\projects\svc-lab\`; company-wide standards in `E:\CLAUDE\COMPANY\`.

- Stack: Next.js App Router, TypeScript, Tailwind. No database, no auth, no accounts, no uploads —
  every calculation runs client-side from form inputs.
- All formulas and reference data live in `lib/bowl-blank.ts`, `lib/rough-out-drying.ts`, and
  `lib/wood-species-data.ts`, each with a header comment citing its sources and retrieval date.
  Don't change a number or formula without re-checking it — see `docs/domain-reference.md` for the
  domain-expert review.
- The rough-wall-thickness rule (10% of diameter), the drying-time range, and the bowl-blank
  truing/pith-avoidance guidance are all explicitly labeled as shop rules of thumb, not
  guarantees — every source this tool is built from makes the same point (weigh the blank to
  confirm it's dry, don't estimate). Don't strengthen that language into a firmer claim than the
  sources support.
- `npm install`/`npm ci` need `--legacy-peer-deps` (a live npm/arborist bug, not specific to this
  project — see `svc-lab/HANDOVER.md`).
- Two test layers: `npx vitest run` (`tests/unit/*.test.ts`) and `npx playwright test`
  (`tests/e2e/*.spec.ts`). Both must pass, plus `npx eslint .` and `npm run build`, before calling a
  change done.
- See `E:\CLAUDE\COMPANY\INFRASTRUCTURE_DEPLOY.md` for the redeploy command once live.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
