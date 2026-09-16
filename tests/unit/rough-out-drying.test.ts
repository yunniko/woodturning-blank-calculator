import { describe, expect, it } from "vitest";
import { estimateRoughOut, ROUGH_WALL_MIN_IN } from "@/lib/rough-out-drying";
import { TURNING_SPECIES } from "@/lib/wood-species-data";

const walnut = TURNING_SPECIES.find((s) => s.species === "Black Walnut")!;
const beech = TURNING_SPECIES.find((s) => s.species === "American Beech")!;

describe("estimateRoughOut", () => {
  it("computes 10% of bowl diameter as the rough wall thickness", () => {
    const result = estimateRoughOut(10, walnut);
    expect(result.roughWallThicknessIn).toBe(1);
  });

  it("floors the rough wall thickness at the minimum for small blanks", () => {
    const result = estimateRoughOut(2, walnut);
    expect(result.roughWallThicknessIn).toBe(ROUGH_WALL_MIN_IN);
  });

  it("gives the same drying range for two species at the same wall thickness", () => {
    const walnutResult = estimateRoughOut(10, walnut);
    const beechResult = estimateRoughOut(10, beech);
    expect(beechResult.dryingRangeMonths).toEqual(walnutResult.dryingRangeMonths);
  });

  it("gives a longer drying range for a thicker rough wall than a thinner one", () => {
    const thin = estimateRoughOut(2, walnut); // floors to ROUGH_WALL_MIN_IN (0.5in)
    const thick = estimateRoughOut(16, walnut); // 1.6in wall
    expect(thick.dryingRangeMonths[0]).toBeGreaterThan(thin.dryingRangeMonths[0]);
    expect(thick.dryingRangeMonths[1]).toBeGreaterThan(thin.dryingRangeMonths[1]);
  });

  it("names the species and its warp spread in the warp note", () => {
    const result = estimateRoughOut(10, beech);
    expect(result.warpNote).toContain("American Beech");
    expect(result.warpNote).toContain(String(beech.warpSpreadPct));
  });

  it("rejects a non-positive bowl diameter", () => {
    expect(() => estimateRoughOut(0, walnut)).toThrow(RangeError);
    expect(() => estimateRoughOut(-5, walnut)).toThrow(RangeError);
  });
});
