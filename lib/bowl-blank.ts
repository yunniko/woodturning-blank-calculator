// Log → bowl-blank yield math.
//
// Sources (retrieved 2026-09-16):
// - Pith avoidance: cutting through/near the pith is widely documented as a
//   cause of cracking as the blank dries, e.g. American Association of
//   Woodturners forum discussion, "Bowl blank dimensions"
//   (https://www.aawforum.org/community/threads/bowl-blank-dimensions.23348/).
// - "Add 2-4 inches to your desired finished bowl diameter" when sizing the
//   blank you cut, to leave room for truing round and for surface checking:
//   Exotic Wood Zone, "Turning Blank vs. Bowl Blank"
//   (https://exoticwoodzone.com/blogs/e/turning-blank-vs-bowl-blank-which-do-you-actually-need/).
//   We use the low end of that range (2 in) as the default and let the user
//   raise it.
// - Bowl proportion (diameter:height) of roughly 2:1 to 3:1 as a common
//   turning guideline: American Association of Woodturners forum discussion,
//   "What's a good average bowl blank size"
//   (https://www.aawforum.org/community/threads/whats-a-good-average-bowl-blank-size.12727/).
//   This is a starting-point proportion, not a rule — many well-known bowl
//   forms fall outside it deliberately.
//
// This tool models cutting one blank per cross-sectional disk along the
// log's length, centered on the pith. A 2026-09-16 domain review found this
// is NOT the dominant real-world method — most turners split the log
// lengthwise through the pith first (excluding it entirely) and get two
// blanks per section, because a full disk with the pith intact reliably
// cracks while drying. The disk model here is kept as a narrower,
// explicitly-labeled alternative (shallow platters, or a log much wider
// than the desired bowl, where the pith can be cut away separately) — see
// the FAQ on `/bowl-blank-calculator` for the full explanation. Modeling the
// split-through-pith yield itself is out of scope for now (it depends on
// bandsaw layout, not just arithmetic on the log's round dimensions). For a
// log much wider than the desired bowl, an experienced turner can also rip
// additional disk blanks from the material around a central one (e.g. on a
// bandsaw) — that 2-D packing problem is out of scope here too; the result
// copy says so rather than silently under-counting.
//
// Suggested bowl height is clamped to the blank thickness (minus a small
// tenon/waste allowance) — a 2026-09-16 domain review found the proportion-
// based range could otherwise suggest a height taller than the blank
// actually is.

export interface BowlBlankInput {
  logDiameterIn: number;
  logLengthIn: number;
  barkTrimIn: number;
  blankThicknessIn: number;
  kerfIn: number;
  truingAllowanceIn: number;
}

export interface BowlBlankResult {
  blankDiameterIn: number;
  blankCount: number;
  maxBowlDiameterIn: number;
  suggestedHeightRangeIn: [number, number];
  /** True when the diameter-proportion height range was cut down to fit the blank's own thickness. */
  heightLimitedByBlankThickness: boolean;
  usedLengthIn: number;
  leftoverLengthIn: number;
}

/** Waste/tenon allowance subtracted from blank thickness before it caps suggested bowl height. */
export const HEIGHT_WASTE_ALLOWANCE_IN = 0.75;

export function calculateBowlBlanks(input: BowlBlankInput): BowlBlankResult {
  const { logDiameterIn, logLengthIn, barkTrimIn, blankThicknessIn, kerfIn, truingAllowanceIn } = input;

  if (logDiameterIn <= 0 || logLengthIn <= 0 || blankThicknessIn <= 0) {
    throw new RangeError("Log diameter, log length, and blank thickness must all be greater than zero.");
  }
  if (barkTrimIn < 0 || kerfIn < 0 || truingAllowanceIn < 0) {
    throw new RangeError("Bark trim, kerf, and truing allowance cannot be negative.");
  }

  const blankDiameterIn = Math.max(0, logDiameterIn - barkTrimIn);
  const perBlankLengthIn = blankThicknessIn + kerfIn;
  const blankCount = Math.max(0, Math.floor(logLengthIn / perBlankLengthIn));
  const usedLengthIn = blankCount * perBlankLengthIn;
  const leftoverLengthIn = Math.max(0, logLengthIn - usedLengthIn);

  const maxBowlDiameterIn = Math.max(0, blankDiameterIn - truingAllowanceIn);
  const proportionHeightRangeIn: [number, number] = [
    Math.round((maxBowlDiameterIn / 3) * 100) / 100,
    Math.round((maxBowlDiameterIn / 2) * 100) / 100,
  ];
  const maxHeightFromThicknessIn = Math.max(0, Math.round((blankThicknessIn - HEIGHT_WASTE_ALLOWANCE_IN) * 100) / 100);
  const suggestedHeightRangeIn: [number, number] = [
    Math.min(proportionHeightRangeIn[0], maxHeightFromThicknessIn),
    Math.min(proportionHeightRangeIn[1], maxHeightFromThicknessIn),
  ];
  const heightLimitedByBlankThickness = proportionHeightRangeIn[1] > maxHeightFromThicknessIn;

  return {
    blankDiameterIn: Math.round(blankDiameterIn * 100) / 100,
    blankCount,
    maxBowlDiameterIn: Math.round(maxBowlDiameterIn * 100) / 100,
    suggestedHeightRangeIn,
    heightLimitedByBlankThickness,
    usedLengthIn: Math.round(usedLengthIn * 100) / 100,
    leftoverLengthIn: Math.round(leftoverLengthIn * 100) / 100,
  };
}
