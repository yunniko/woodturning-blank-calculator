// Common turning-wood species reference data.
//
// Radial %, tangential % shrinkage (green to ovendry): USDA Forest Products
// Laboratory Wood Handbook Table 4-3, as tabulated by Woodbin ("Wood
// Shrinkage Table", https://woodbin.com/ref/wood-shrinkage-table/, retrieved
// 2026-09-16), cross-checked against The Wood Database's per-species pages
// (retrieved 2026-09-16 during domain review) — all 14 rows matched.
//
// Warp indicator: the ABSOLUTE difference between tangential and radial
// shrinkage (tangentialShrinkPct - radialShrinkPct), not their ratio. A
// domain review on 2026-09-16 found that the ratio is the standard indicator
// for shape distortion *per unit of total shrinkage* in seasoned lumber, but
// is the wrong variable for how much a green turning blank will oval —
// that's driven by the absolute spread between the two shrinkage percentages
// (scaled by diameter). Using the ratio inverted the guidance for at least
// two species (dense, high-difference woods like hickory read as "stays
// round" under the ratio; low-density, high-ratio woods like aspen read as
// "warps a lot" when their absolute spread is actually small).
//
// Janka hardness (lbf): 8 Billion Trees, "Janka Wood Hardness Scale Chart"
// (https://8billiontrees.com/trees/wood-hardness-scale/, retrieved
// 2026-09-16). Quaking Aspen and Black Locust weren't in that chart; The Wood
// Database gives Quaking Aspen 350 lbf and Black Locust 1700 lbf — used here.
// A 2026-09-16 domain review flagged that Janka figures vary a few percent
// between published sources depending on test convention (side vs. end
// grain, sample set) — treat all figures here as representative, not exact.
//
// Toxicity/sensitization notes: The Wood Database, "Wood Allergies and
// Toxicity" (https://www.wood-database.com/wood-articles/wood-allergies-and-toxicity/,
// retrieved 2026-09-16), which documents reported reactions without ranking
// severity — these notes are phrased the same way EXCEPT where a domain
// review (2026-09-16) found independent, more serious evidence: oak and
// beech dust are classified by ACGIH as A1 (confirmed human carcinogen),
// based on IARC evidence linking long-term hardwood-dust exposure to
// sinonasal adenocarcinoma, with oak and beech specifically named as the
// strongest-evidence species (IARC Vol. 62; OSHA woodworking eTool; CCOHS).
// That's stated plainly here rather than downgraded to match the source
// page's own non-ranking convention, because presenting beech as equally
// mild as species with no such classification would be misleading.
export interface TurningSpeciesRow {
  species: string;
  radialShrinkPct: number;
  tangentialShrinkPct: number;
  /** tangentialShrinkPct - radialShrinkPct: absolute drying-distortion indicator (not a ratio). */
  warpSpreadPct: number;
  jankaHardnessLbf: number;
  warpTendency: "Lower" | "Moderate" | "Higher";
  toxicityNote: string;
  turningNote: string;
}

// Warp-tendency banding from warpSpreadPct across this 14-species set (range
// 2.2-6.4): "Lower" is roughly the bottom third, "Higher" the top third. A
// relative label across these species, not an absolute wood-science category.
function bandWarpTendency(warpSpreadPct: number): TurningSpeciesRow["warpTendency"] {
  if (warpSpreadPct <= 3.0) return "Lower";
  if (warpSpreadPct <= 4.5) return "Moderate";
  return "Higher";
}

interface RawRow {
  species: string;
  radialShrinkPct: number;
  tangentialShrinkPct: number;
  jankaHardnessLbf: number;
  toxicityNote: string;
  turningNote: string;
}

const RAW_ROWS: RawRow[] = [
  {
    species: "Black Walnut",
    radialShrinkPct: 5.5,
    tangentialShrinkPct: 7.8,
    jankaHardnessLbf: 1010,
    toxicityNote: "Reported irritant/sensitizer; rare nasopharyngeal-cancer (NPC) reports in wood-dust literature.",
    turningNote: "Comparatively stable while drying (low warp spread); a popular first bowl-blank species.",
  },
  {
    species: "Black Cherry",
    radialShrinkPct: 3.7,
    tangentialShrinkPct: 7.1,
    jankaHardnessLbf: 950,
    toxicityNote: "Reported wheezing/giddiness in some woodworkers.",
    turningNote: "Turns and finishes cleanly; darkens with age and light exposure.",
  },
  {
    species: "Northern Red Oak",
    radialShrinkPct: 4.0,
    tangentialShrinkPct: 8.6,
    jankaHardnessLbf: 1290,
    toxicityNote:
      "Reported irritant/sensitizer, asthma; rare NPC reports. Oak dust is also classified by ACGIH as A1 (confirmed human carcinogen), based on IARC evidence linking long-term hardwood-dust exposure to sinonasal adenocarcinoma — use real dust collection and a properly rated respirator, not just a comfort mask.",
    turningNote: "Open pores (ray fleck shows on quartered blanks); higher warp spread — expect more distortion drying.",
  },
  {
    species: "White Oak",
    radialShrinkPct: 5.6,
    tangentialShrinkPct: 10.5,
    jankaHardnessLbf: 1360,
    toxicityNote:
      "Same oak-dust cautions as red oak: reported irritant/sensitizer, asthma, rare NPC reports, and the same ACGIH A1 carcinogen classification.",
    turningNote: "Closed pores, more water/rot resistant than red oak; among the higher-shrinkage species here.",
  },
  {
    species: "Sugar Maple",
    radialShrinkPct: 4.8,
    tangentialShrinkPct: 9.9,
    jankaHardnessLbf: 1450,
    toxicityNote:
      "Reported irritant/sensitizer, asthma. Spalted or moldy wood of ANY species (not maple specifically) can carry a separate hypersensitivity-pneumonitis (HP) risk from the mold/fungus itself — Cryptostroma corticale ('maple bark disease') is the best-documented case and chronic exposure has caused lung fibrosis in wood handlers, so use a properly rated respirator (not a comfort dust mask) on any spalted/moldy blank, whatever the species.",
    turningNote: "Hard, dense, pale — a common bowl and utensil wood; takes detail well.",
  },
  {
    species: "Red Maple",
    radialShrinkPct: 4.0,
    tangentialShrinkPct: 8.2,
    jankaHardnessLbf: 950,
    toxicityNote: "Same maple-dust cautions as sugar maple, including the spalted/moldy-wood hypersensitivity-pneumonitis (HP) risk.",
    turningNote: "Softer and often more figured (spalting, mineral streaks) than sugar maple.",
  },
  {
    species: "White Ash",
    radialShrinkPct: 4.9,
    tangentialShrinkPct: 7.8,
    jankaHardnessLbf: 1320,
    toxicityNote: "Reported irritant (The Wood Database); no carcinogen classification found — standard wood-dust precautions still apply.",
    turningNote: "Strong, open-grained; increasingly scarce in some regions due to emerald ash borer dieback — often available as salvaged log wood.",
  },
  {
    species: "Yellow Birch",
    radialShrinkPct: 7.3,
    tangentialShrinkPct: 9.5,
    jankaHardnessLbf: 1260,
    toxicityNote: "Reported irritant, sensitizer, and nausea (The Wood Database); standard wood-dust precautions still apply.",
    turningNote: "High shrinkage but a comparatively low warp spread, so it moves a lot in volume but stays rounder.",
  },
  {
    species: "American Beech",
    radialShrinkPct: 5.5,
    tangentialShrinkPct: 11.9,
    jankaHardnessLbf: 1300,
    toxicityNote:
      "Reported irritant/sensitizer with rare NPC reports (The Wood Database) — and, like oak, beech dust is classified by ACGIH as A1 (confirmed human carcinogen), one of the two species most strongly linked to sinonasal adenocarcinoma in the IARC evidence base. This is one of the more serious entries in this table, not a mild one — use real dust collection and a properly rated respirator.",
    turningNote: "Highest tangential shrinkage and warp spread in this list — expect the most distortion; leave extra rough-out wall thickness.",
  },
  {
    species: "American Sycamore",
    radialShrinkPct: 5.0,
    tangentialShrinkPct: 8.4,
    jankaHardnessLbf: 770,
    toxicityNote: "No documented severe reaction profile found beyond standard wood-dust precautions; commonly spalted stock still carries the mold-based HP risk noted under maple.",
    turningNote: "Distinctive fleck figure on quartered blanks; softer and easier to turn than the oaks/maples above.",
  },
  {
    species: "Quaking Aspen",
    radialShrinkPct: 3.5,
    tangentialShrinkPct: 6.7,
    jankaHardnessLbf: 350,
    toxicityNote: "No documented severe reaction profile found beyond standard wood-dust precautions.",
    turningNote: "Very soft, low density, and low warp spread — dries faster than denser species and is a forgiving practice wood, but dents/tears easily.",
  },
  {
    species: "American Basswood",
    radialShrinkPct: 6.6,
    tangentialShrinkPct: 9.3,
    jankaHardnessLbf: 410,
    toxicityNote: "No documented severe reaction profile found beyond standard wood-dust precautions.",
    turningNote: "Soft, fine, even grain — a classic carving/practice wood; low warp spread keeps it relatively round.",
  },
  {
    species: "Black Locust",
    radialShrinkPct: 4.6,
    tangentialShrinkPct: 7.2,
    jankaHardnessLbf: 1700,
    toxicityNote: "Reported irritant and nausea (The Wood Database); standard wood-dust precautions still apply.",
    turningNote: "Very hard, dense, and rot-resistant; comparatively stable (low warp spread) for a hardwood this dense — but dense means slow-drying.",
  },
  {
    species: "Shagbark Hickory",
    radialShrinkPct: 7.0,
    tangentialShrinkPct: 10.5,
    jankaHardnessLbf: 1820,
    toxicityNote: "No documented severe reaction profile found beyond standard wood-dust precautions.",
    turningNote: "Hardest and among the densest species here — tough on tools, very durable finished, and slow to dry because of that density, not because of its warp spread.",
  },
];

export const TURNING_SPECIES: TurningSpeciesRow[] = RAW_ROWS.map((row) => {
  const warpSpreadPct = Math.round((row.tangentialShrinkPct - row.radialShrinkPct) * 100) / 100;
  return { ...row, warpSpreadPct, warpTendency: bandWarpTendency(warpSpreadPct) };
});
