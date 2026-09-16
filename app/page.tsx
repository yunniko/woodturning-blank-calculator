import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Woodturning Blank Calculator</h1>
      <p className="mt-4 text-gray-600">
        Free tools for woodturners: figure out how many bowl blanks a log will
        yield, get a rough-turning wall-thickness and drying-time estimate for
        green wood, and look up a sourced reference chart of common turning
        species. No signup, nothing uploaded — everything runs in your
        browser.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/bowl-blank-calculator"
          className="rounded-lg border border-gray-300 p-5 hover:border-gray-500"
          data-testid="tool-card-bowl-blank-calculator"
        >
          <h2 className="font-semibold">Log-to-bowl-blank calculator</h2>
          <p className="mt-1 text-sm text-gray-600">
            Log diameter &amp; length → how many blanks, and the max bowl size
            each one supports.
          </p>
        </Link>
        <Link
          href="/rough-out-drying-calculator"
          className="rounded-lg border border-gray-300 p-5 hover:border-gray-500"
          data-testid="tool-card-rough-out-drying-calculator"
        >
          <h2 className="font-semibold">Rough-out wall &amp; drying estimator</h2>
          <p className="mt-1 text-sm text-gray-600">
            Bowl diameter &amp; species → rough wall thickness and a drying-time
            range for twice-turning green wood.
          </p>
        </Link>
        <Link
          href="/turning-wood-reference"
          className="rounded-lg border border-gray-300 p-5 hover:border-gray-500 sm:col-span-2"
          data-testid="tool-card-turning-wood-reference"
        >
          <h2 className="font-semibold">Turning wood species reference</h2>
          <p className="mt-1 text-sm text-gray-600">
            Sourced hardness, shrinkage, warp tendency, and dust-safety notes
            for 14 common turning species.
          </p>
        </Link>
      </div>

      <p className="mt-8 text-sm text-gray-500">
        These are shop rules of thumb and published wood-property data (see
        each tool for sources), not a guarantee — always confirm a blank is
        actually dry by weight, not by calendar time.
      </p>
    </main>
  );
}
