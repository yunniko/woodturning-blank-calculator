"use client";

import { useMemo, useState } from "react";
import { calculateBowlBlanks } from "@/lib/bowl-blank";

export function BowlBlankTool() {
  const [logDiameterIn, setLogDiameterIn] = useState("16");
  const [logLengthIn, setLogLengthIn] = useState("20");
  const [barkTrimIn, setBarkTrimIn] = useState("2");
  const [blankThicknessIn, setBlankThicknessIn] = useState("6");
  const [kerfIn, setKerfIn] = useState("0.25");
  const [truingAllowanceIn, setTruingAllowanceIn] = useState("2");

  const result = useMemo(() => {
    const nums = {
      logDiameterIn: Number(logDiameterIn),
      logLengthIn: Number(logLengthIn),
      barkTrimIn: Number(barkTrimIn),
      blankThicknessIn: Number(blankThicknessIn),
      kerfIn: Number(kerfIn),
      truingAllowanceIn: Number(truingAllowanceIn),
    };
    if (Object.values(nums).some((n) => !Number.isFinite(n))) {
      return { value: null, error: "Enter a number in every field." };
    }
    try {
      return { value: calculateBowlBlanks(nums), error: null as string | null };
    } catch (err) {
      return { value: null, error: err instanceof Error ? err.message : "Invalid input." };
    }
  }, [logDiameterIn, logLengthIn, barkTrimIn, blankThicknessIn, kerfIn, truingAllowanceIn]);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <label className="block text-sm">
          Log diameter (inches, over bark)
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.5"
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1"
            value={logDiameterIn}
            onChange={(e) => setLogDiameterIn(e.target.value)}
            data-testid="log-diameter"
          />
        </label>
        <label className="block text-sm">
          Usable log length (inches)
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.5"
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1"
            value={logLengthIn}
            onChange={(e) => setLogLengthIn(e.target.value)}
            data-testid="log-length"
          />
        </label>
        <label className="block text-sm">
          Bark / waney-edge trim (inches, both sides combined)
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.25"
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1"
            value={barkTrimIn}
            onChange={(e) => setBarkTrimIn(e.target.value)}
            data-testid="bark-trim"
          />
        </label>
        <label className="block text-sm">
          Blank thickness per disk (inches)
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.25"
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1"
            value={blankThicknessIn}
            onChange={(e) => setBlankThicknessIn(e.target.value)}
            data-testid="blank-thickness"
          />
        </label>
        <label className="block text-sm">
          Saw kerf loss per cut (inches)
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.0625"
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1"
            value={kerfIn}
            onChange={(e) => setKerfIn(e.target.value)}
            data-testid="kerf"
          />
        </label>
        <label className="block text-sm">
          Truing-round allowance (inches off blank diameter)
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.5"
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1"
            value={truingAllowanceIn}
            onChange={(e) => setTruingAllowanceIn(e.target.value)}
            data-testid="truing-allowance"
          />
        </label>
      </form>

      <div data-testid="bowl-blank-result" className="rounded-lg border border-gray-300 p-5">
        {result.error && <p className="text-red-600">{result.error}</p>}
        {result.value !== null && (
          <>
            <h2 className="text-lg font-semibold">Estimated yield</h2>
            <p className="mt-3 text-2xl font-semibold" data-testid="blank-count">
              {result.value.blankCount} blank{result.value.blankCount === 1 ? "" : "s"}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              each {result.value.blankDiameterIn}in diameter × your chosen
              thickness, using {result.value.usedLengthIn}in of the log (
              {result.value.leftoverLengthIn}in left over).
            </p>
            <p className="mt-4 text-sm text-gray-700">
              Max bowl diameter per blank:{" "}
              <strong data-testid="max-bowl-diameter">{result.value.maxBowlDiameterIn}in</strong>
            </p>
            <p className="mt-1 text-sm text-gray-700">
              Suggested bowl height range:{" "}
              <strong data-testid="height-range">
                {result.value.suggestedHeightRangeIn[0]}in – {result.value.suggestedHeightRangeIn[1]}in
              </strong>{" "}
              (2:1 to 3:1 diameter:height, a common starting proportion — not a
              rule)
              {result.value.heightLimitedByBlankThickness && (
                <span data-testid="height-limited-note">
                  {" "}
                  — capped by your blank thickness minus a small tenon/waste
                  allowance, not by the proportion guideline.
                </span>
              )}
              .
            </p>
            <p className="mt-4 text-sm text-gray-500">
              This assumes one blank per cross-cut disk, centered on the
              pith — a narrower alternative to the more common
              split-through-the-pith method (see the FAQ below). If your log
              is much wider than the bowl you want, an experienced turner can
              also rip extra blanks from the material around a central disk
              (e.g. on a bandsaw) — that isn&apos;t modeled here.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
