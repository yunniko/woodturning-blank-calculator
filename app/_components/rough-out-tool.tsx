"use client";

import { useMemo, useState } from "react";
import { estimateRoughOut } from "@/lib/rough-out-drying";
import { TURNING_SPECIES } from "@/lib/wood-species-data";

export function RoughOutTool() {
  const [bowlDiameterIn, setBowlDiameterIn] = useState("10");
  const [speciesName, setSpeciesName] = useState(TURNING_SPECIES[0].species);

  const result = useMemo(() => {
    const n = Number(bowlDiameterIn);
    const species = TURNING_SPECIES.find((s) => s.species === speciesName);
    if (!Number.isFinite(n) || n <= 0) return { value: null, error: "Enter a bowl diameter greater than zero." };
    if (!species) return { value: null, error: "Choose a species." };
    try {
      return { value: estimateRoughOut(n, species), error: null as string | null };
    } catch (err) {
      return { value: null, error: err instanceof Error ? err.message : "Invalid input." };
    }
  }, [bowlDiameterIn, speciesName]);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <label className="block text-sm">
          Target finished bowl diameter (inches)
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.5"
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1"
            value={bowlDiameterIn}
            onChange={(e) => setBowlDiameterIn(e.target.value)}
            data-testid="bowl-diameter"
          />
        </label>
        <label className="block text-sm">
          Species
          <select
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1"
            value={speciesName}
            onChange={(e) => setSpeciesName(e.target.value)}
            data-testid="species-select"
          >
            {TURNING_SPECIES.map((s) => (
              <option key={s.species} value={s.species}>
                {s.species}
              </option>
            ))}
          </select>
        </label>
      </form>

      <div data-testid="rough-out-result" className="rounded-lg border border-gray-300 p-5">
        {result.error && <p className="text-red-600">{result.error}</p>}
        {result.value !== null && (
          <>
            <h2 className="text-lg font-semibold">Rough-out guidance</h2>
            <p className="mt-3 text-2xl font-semibold" data-testid="wall-thickness">
              {result.value.roughWallThicknessIn}in rough wall
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Starting point: 10% of bowl diameter (a widely-used shop rule,
              not a guarantee), floored at 0.5in for small blanks.
            </p>
            <p className="mt-4 text-sm text-gray-700">
              Typical drying time (paper-bag method):{" "}
              <strong data-testid="drying-range">
                {result.value.dryingRangeMonths[0]}–{result.value.dryingRangeMonths[1]} months
              </strong>
            </p>
            <p className="mt-2 text-sm text-gray-600">{result.value.warpNote}</p>
            <p className="mt-4 text-sm text-gray-500">
              The reliable way to know it&apos;s actually dry: weigh the blank
              weekly on a kitchen scale. Once the weight stops dropping
              between weighings, it&apos;s ready for final turning — trust
              the scale over the calendar.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
