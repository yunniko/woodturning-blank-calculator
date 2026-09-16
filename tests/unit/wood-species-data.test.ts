import { describe, expect, it } from "vitest";
import { TURNING_SPECIES } from "@/lib/wood-species-data";

describe("TURNING_SPECIES", () => {
  it("has no duplicate species names", () => {
    const names = TURNING_SPECIES.map((s) => s.species);
    expect(new Set(names).size).toBe(names.length);
  });

  it("computes warpSpreadPct consistently from the raw shrinkage figures", () => {
    for (const row of TURNING_SPECIES) {
      const expected = Math.round((row.tangentialShrinkPct - row.radialShrinkPct) * 100) / 100;
      expect(row.warpSpreadPct).toBeCloseTo(expected, 2);
    }
  });

  it("gives every row a positive Janka hardness and shrinkage figure", () => {
    for (const row of TURNING_SPECIES) {
      expect(row.jankaHardnessLbf).toBeGreaterThan(0);
      expect(row.radialShrinkPct).toBeGreaterThan(0);
      expect(row.tangentialShrinkPct).toBeGreaterThan(0);
    }
  });

  it("bands warp tendency consistently with the warpSpreadPct thresholds", () => {
    for (const row of TURNING_SPECIES) {
      if (row.warpSpreadPct <= 3.0) expect(row.warpTendency).toBe("Lower");
      else if (row.warpSpreadPct <= 4.5) expect(row.warpTendency).toBe("Moderate");
      else expect(row.warpTendency).toBe("Higher");
    }
  });

  it("flags spalted maple's hypersensitivity-pneumonitis risk on both maple rows", () => {
    const maples = TURNING_SPECIES.filter((s) => s.species.includes("Maple"));
    expect(maples.length).toBe(2);
    for (const maple of maples) {
      expect(maple.toxicityNote.toLowerCase()).toContain("hypersensitivity");
    }
  });
});
