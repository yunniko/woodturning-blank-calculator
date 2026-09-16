# D001 · Domain review found and fixed 5 blocking model/data issues
Date: 2026-09-16 · Goal: svc-lab G-001 (idea #49) · Status: active (superseded by: —)
Context: pre-ship domain-expert review of the wood-science/woodturning formulas found the
drying-time model used the wrong shrinkage variable, ignored wall thickness, mis-stated
American Beech's toxicity class, framed a minority blank-cutting method as the common case,
and could suggest a bowl height taller than the blank.
Decision: fix all 5 in the data/logic layer rather than shipping with caveats — (1)-(2) drying
time now keyed to `roughWallThicknessIn` only, not species; warp indicator changed from a
tangential:radial ratio to the absolute `warpSpreadPct` difference; (3) toxicity notes rewritten,
Beech flagged ACGIH A1; (4) the disk/pith-center model is kept as the only one computed but
reframed as an alternative to the dominant split-through-pith method, not the default; (5)
`suggestedHeightRangeIn` clamped to blank thickness minus a 0.75in waste allowance.
Rejected: modeling the split-through-pith yield directly (out of scope — depends on bandsaw
layout, not just round-log arithmetic); keeping the ratio-based warp indicator with a caveat
(would still misrank species, not just under-explain them).
Consequence: any future change to `wood-species-data.ts` or `rough-out-drying.ts` must keep
drying time thickness-driven and warp banding difference-based, not ratio-based.
Evidence: tests/unit/{bowl-blank,rough-out-drying,wood-species-data}.test.ts; docs/domain-reference.md
