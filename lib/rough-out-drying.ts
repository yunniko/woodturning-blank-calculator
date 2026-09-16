// Rough-turned (twice-turning) wall thickness and drying-time guidance for
// green wood, sourced 2026-09-16:
//
// - The "10% of diameter" rough-wall rule: American Association of
//   Woodturners forum, "Wall thickness for twice turned bowls"
//   (https://www.aawforum.org/community/threads/wall-thickness-for-twice-turned-bowls.23216/)
//   — "wall thickness needs to be about ten percent of the overall bowl
//   diameter... a 10-inch wide bowl should have a rough wall about 1-inch
//   thick," with the same thread noting stable species (e.g. black walnut)
//   can go thinner and highly-figured/burl/high-movement wood needs more.
// - Drying-time range: multiple AAW forum threads on paper-bag drying
//   ("Drying time for rough turned blanks",
//   https://www.aawforum.org/community/threads/drying-time-for-rough-turned-blanks.21568/;
//   "Roughed Out Bowls - Paper Bag Drying Method",
//   https://www.aawforum.org/community/threads/roughed-out-bowls-paper-bag-drying-method-only-or-boiling.10828/)
//   and Turn A Wood Bowl, "Drying Green Wood Bowls"
//   (https://turnawoodbowl.com/drying-green-wood-bowls-6-methods-success/):
//   reported times cluster around 3-8 months for a standard paper-bag
//   rough-out, with denser/thicker blanks and cooler/damper shops running
//   longer. All of these sources agree the reliable signal is weight
//   stabilizing on a kitchen scale (weigh weekly; when the weight stops
//   dropping between weighings, it's dry), not a calendar date — this tool
//   reports a wide range for planning purposes only and says so explicitly.
//
// A 2026-09-16 domain review found an earlier version of this tool keyed the
// drying-time range off the species' warp tendency instead of the rough
// wall thickness — the wrong variable (it ignored a 4in-vs-16in-diameter
// difference entirely, and none of the cited sources tie drying time to
// warp tendency in the first place). Drying time here is now driven by
// roughWallThicknessIn only, per the sources above (thicker wall = more
// wood to dry through = longer). Warp spread (tangential minus radial
// shrinkage, from wood-species-data.ts) is used only for the wall-thickness
// rounding-up note below, not for the drying-time estimate.
//
// This is a set of widely-repeated shop rules of thumb from the turning
// community, not a physics model — presented as guidance, never a guarantee.

import type { TurningSpeciesRow } from "./wood-species-data";

export const ROUGH_WALL_THICKNESS_FRACTION = 0.1;
export const ROUGH_WALL_MIN_IN = 0.5;

export interface RoughOutResult {
  roughWallThicknessIn: number;
  dryingRangeMonths: [number, number];
  warpNote: string;
}

export function estimateRoughOut(bowlDiameterIn: number, species: TurningSpeciesRow): RoughOutResult {
  if (bowlDiameterIn <= 0) {
    throw new RangeError("Bowl diameter must be greater than zero.");
  }

  const baseThickness = bowlDiameterIn * ROUGH_WALL_THICKNESS_FRACTION;
  const roughWallThicknessIn = Math.round(Math.max(baseThickness, ROUGH_WALL_MIN_IN) * 100) / 100;

  // Drying time keyed off wall thickness only (more wood to dry through =
  // longer), per the AAW/Turn A Wood Bowl sources above. Bands chosen to
  // land inside the sources' overall reported 3-8 month range.
  const dryingRangeMonths: [number, number] =
    roughWallThicknessIn < 0.75 ? [3, 5] : roughWallThicknessIn <= 1.25 ? [4, 7] : [5, 8];

  const warpNote =
    species.warpTendency === "Higher"
      ? `${species.species} has a higher warp spread (~${species.warpSpreadPct} percentage points between tangential and radial shrinkage) in this reference — expect more ovaling as it dries. Consider rounding up your rough wall thickness beyond the 10% starting point.`
      : species.warpTendency === "Moderate"
        ? `${species.species} has a moderate warp spread (~${species.warpSpreadPct} percentage points) — some ovaling is normal; the 10% rough-wall rule is a reasonable starting point.`
        : `${species.species} has a comparatively low warp spread (~${species.warpSpreadPct} percentage points) in this reference — it tends to stay rounder than most as it dries, so a slightly thinner rough wall is often workable.`;

  return { roughWallThicknessIn, dryingRangeMonths, warpNote };
}
