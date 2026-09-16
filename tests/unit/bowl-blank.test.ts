import { describe, expect, it } from "vitest";
import { calculateBowlBlanks } from "@/lib/bowl-blank";

describe("calculateBowlBlanks", () => {
  it("computes blank diameter after bark trim", () => {
    const result = calculateBowlBlanks({
      logDiameterIn: 16,
      logLengthIn: 20,
      barkTrimIn: 2,
      blankThicknessIn: 6,
      kerfIn: 0.25,
      truingAllowanceIn: 2,
    });
    expect(result.blankDiameterIn).toBe(14);
  });

  it("floors the blank count and accounts for kerf loss per cut", () => {
    const result = calculateBowlBlanks({
      logDiameterIn: 16,
      logLengthIn: 20,
      barkTrimIn: 2,
      blankThicknessIn: 6,
      kerfIn: 0.25,
      truingAllowanceIn: 2,
    });
    // 20 / 6.25 = 3.2 -> 3 blanks
    expect(result.blankCount).toBe(3);
    expect(result.usedLengthIn).toBeCloseTo(18.75, 2);
    expect(result.leftoverLengthIn).toBeCloseTo(1.25, 2);
  });

  it("subtracts the truing allowance to get max bowl diameter", () => {
    const result = calculateBowlBlanks({
      logDiameterIn: 16,
      logLengthIn: 20,
      barkTrimIn: 2,
      blankThicknessIn: 6,
      kerfIn: 0.25,
      truingAllowanceIn: 2,
    });
    expect(result.maxBowlDiameterIn).toBe(12);
  });

  it("suggests a height range using the 2:1 to 3:1 diameter:height guideline, clamped to blank thickness", () => {
    const result = calculateBowlBlanks({
      logDiameterIn: 16,
      logLengthIn: 20,
      barkTrimIn: 2,
      blankThicknessIn: 6,
      kerfIn: 0.25,
      truingAllowanceIn: 2,
    });
    // maxBowlDiameterIn = 12 -> proportion range [12/3, 12/2] = [4, 6], but
    // blankThicknessIn (6) minus the 0.75in waste allowance = 5.25, so the
    // top of the range is clamped down to 5.25.
    expect(result.suggestedHeightRangeIn).toEqual([4, 5.25]);
    expect(result.heightLimitedByBlankThickness).toBe(true);
  });

  it("does not clamp the height range when the blank is thick enough", () => {
    const result = calculateBowlBlanks({
      logDiameterIn: 16,
      logLengthIn: 20,
      barkTrimIn: 2,
      blankThicknessIn: 10,
      kerfIn: 0.25,
      truingAllowanceIn: 2,
    });
    // maxBowlDiameterIn = 12 -> proportion range [4, 6]; blank thickness 10
    // minus the 0.75in waste allowance = 9.25, well above 6, so unclamped.
    expect(result.suggestedHeightRangeIn).toEqual([4, 6]);
    expect(result.heightLimitedByBlankThickness).toBe(false);
  });

  it("returns zero blanks when the log is shorter than one blank + kerf", () => {
    const result = calculateBowlBlanks({
      logDiameterIn: 16,
      logLengthIn: 5,
      barkTrimIn: 2,
      blankThicknessIn: 6,
      kerfIn: 0.25,
      truingAllowanceIn: 2,
    });
    expect(result.blankCount).toBe(0);
    expect(result.leftoverLengthIn).toBe(5);
  });

  it("never returns a negative blank diameter when bark trim exceeds log diameter", () => {
    const result = calculateBowlBlanks({
      logDiameterIn: 3,
      logLengthIn: 20,
      barkTrimIn: 5,
      blankThicknessIn: 6,
      kerfIn: 0.25,
      truingAllowanceIn: 2,
    });
    expect(result.blankDiameterIn).toBe(0);
    expect(result.maxBowlDiameterIn).toBe(0);
  });

  it("rejects non-positive log diameter, length, or blank thickness", () => {
    const base = { logDiameterIn: 16, logLengthIn: 20, barkTrimIn: 2, blankThicknessIn: 6, kerfIn: 0.25, truingAllowanceIn: 2 };
    expect(() => calculateBowlBlanks({ ...base, logDiameterIn: 0 })).toThrow(RangeError);
    expect(() => calculateBowlBlanks({ ...base, logLengthIn: -1 })).toThrow(RangeError);
    expect(() => calculateBowlBlanks({ ...base, blankThicknessIn: 0 })).toThrow(RangeError);
  });

  it("rejects negative bark trim, kerf, or truing allowance", () => {
    const base = { logDiameterIn: 16, logLengthIn: 20, barkTrimIn: 2, blankThicknessIn: 6, kerfIn: 0.25, truingAllowanceIn: 2 };
    expect(() => calculateBowlBlanks({ ...base, barkTrimIn: -1 })).toThrow(RangeError);
    expect(() => calculateBowlBlanks({ ...base, kerfIn: -1 })).toThrow(RangeError);
    expect(() => calculateBowlBlanks({ ...base, truingAllowanceIn: -1 })).toThrow(RangeError);
  });
});
