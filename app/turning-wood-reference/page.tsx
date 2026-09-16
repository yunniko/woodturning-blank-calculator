import type { Metadata } from "next";
import Link from "next/link";
import { TURNING_SPECIES } from "@/lib/wood-species-data";

export const metadata: Metadata = {
  title: "Turning Wood Species Reference Chart",
  description:
    "Sourced reference chart of Janka hardness, shrinkage, warp tendency, and dust-safety notes for 14 common woodturning species.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-blue-600 hover:underline">
          ← All tools
        </Link>
      </nav>

      <h1 className="text-3xl font-semibold">Turning Wood Species Reference Chart</h1>
      <p className="mt-3 text-gray-600">
        Shrinkage and the warp spread (tangential minus radial shrinkage) are
        from the USDA Forest Products Laboratory, as tabulated by{" "}
        <a href="https://woodbin.com/ref/wood-shrinkage-table/" className="underline">
          Woodbin&apos;s Wood Shrinkage Table
        </a>
        . Janka hardness is from{" "}
        <a href="https://8billiontrees.com/trees/wood-hardness-scale/" className="underline">
          8 Billion Trees&apos; Janka hardness chart
        </a>
        . Toxicity/sensitization notes are from{" "}
        <a href="https://www.wood-database.com/wood-articles/wood-allergies-and-toxicity/" className="underline">
          The Wood Database
        </a>
        , which documents reported reactions without ranking their severity —
        these notes are worded the same way. All retrieved 2026-09-16.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm" data-testid="species-chart">
          <thead>
            <tr className="border-b border-gray-300 text-left">
              <th className="py-2 pr-4">Species</th>
              <th className="py-2 pr-4">Janka (lbf)</th>
              <th className="py-2 pr-4">Radial %</th>
              <th className="py-2 pr-4">Tangential %</th>
              <th className="py-2 pr-4">Warp spread (pp)</th>
              <th className="py-2 pr-4">Warp tendency</th>
              <th className="py-2 pr-4">Dust/health note</th>
              <th className="py-2">Turning note</th>
            </tr>
          </thead>
          <tbody>
            {TURNING_SPECIES.map((row) => (
              <tr key={row.species} className="border-b border-gray-100 align-top">
                <td className="py-2 pr-4 font-medium">{row.species}</td>
                <td className="py-2 pr-4">{row.jankaHardnessLbf}</td>
                <td className="py-2 pr-4">{row.radialShrinkPct}</td>
                <td className="py-2 pr-4">{row.tangentialShrinkPct}</td>
                <td className="py-2 pr-4">{row.warpSpreadPct}</td>
                <td className="py-2 pr-4">{row.warpTendency}</td>
                <td className="py-2 pr-4 text-gray-600">{row.toxicityNote}</td>
                <td className="py-2 text-gray-600">{row.turningNote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Wood dust from any species is a respiratory irritant in enough
        quantity — use dust collection and at minimum a NIOSH N95-rated
        respirator, regardless of species. For extended turning or sanding
        of oak or beech specifically (both ACGIH A1 confirmed-carcinogen
        dust), step up to an FFP2/FFP3 or P100 half-mask respirator, not
        just a comfort mask. These notes flag specific, documented reactions
        beyond that baseline, not an exhaustive medical risk assessment; if
        you have a known wood allergy or sensitivity, follow your own
        doctor&apos;s guidance over this chart.
      </p>
      <p className="mt-3 text-sm text-gray-500">
        Use the{" "}
        <Link href="/rough-out-drying-calculator" className="underline">
          rough-out &amp; drying calculator
        </Link>{" "}
        to see how a species&apos; warp spread affects wall-thickness
        guidance (drying time itself is driven by wall thickness, not
        species).
      </p>
    </main>
  );
}
