import type { Metadata } from "next";
import Link from "next/link";
import { RoughOutTool } from "../_components/rough-out-tool";
import { JsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Rough-Out Wall Thickness & Drying Time Calculator",
  description:
    "Free calculator: bowl diameter and species → a rough-turning wall-thickness starting point and a paper-bag drying-time range for twice-turning green wood.",
};

const FAQ = [
  {
    question: "Why 10% of the diameter for the rough wall?",
    answer:
      "It's a widely-repeated shop rule among turners (see the American Association of Woodturners' own forum discussion on twice-turned wall thickness): a 10-inch bowl gets roughly a 1-inch rough wall. It leaves enough material to true up the bowl into a round shape again after it distorts (ovals) while drying. It's a starting point, not a formula derived from wood science — some turners go thinner on stable species and thicker on ones known to move a lot.",
  },
  {
    question: "Why does the drying-time range change with wall thickness, not species?",
    answer:
      "Every source this tool is built from ties drying time to how much wood the moisture has to travel through, not to species — a thicker rough wall simply takes longer to reach a stable moisture content. Species does still affect how much the blank ovals while drying (see the warp-spread note below the result and the reference chart), which is why it changes the recommended wall-thickness starting point — but the reported 3-8 month drying range here scales with wall thickness only. Every source agrees the reliable signal is weight stabilizing on a scale, not a calendar date.",
  },
  {
    question: "What is the paper-bag method?",
    answer:
      "After rough-turning, the wet blank (often with a handful of its own wet shavings) goes into a paper grocery bag, stored somewhere cool, dark, and free of airflow. The bag slows moisture loss so the wood has time to relax rather than crack. Turners typically re-bag it in a fresh bag every week or two and weigh it each time.",
  },
  {
    question: "Is my data uploaded anywhere?",
    answer: "No. Everything runs in your browser — nothing you type is sent to a server.",
  },
];

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />

      <nav className="mb-6 text-sm">
        <Link href="/" className="text-blue-600 hover:underline">
          ← All tools
        </Link>
      </nav>

      <h1 className="text-3xl font-semibold">
        Rough-Out Wall Thickness &amp; Drying Time Calculator
      </h1>
      <p className="mt-3 text-gray-600">
        For the classic &quot;twice-turning&quot; method: rough-turn a green
        blank thick, let it dry and distort, then true it up into the
        finished bowl. Pick your target bowl diameter and species for a
        starting wall thickness and a drying-time range.
      </p>

      <div className="mt-6">
        <RoughOutTool />
      </div>

      <p className="mt-8 text-sm text-gray-500">
        Need blank sizes first? Use the{" "}
        <Link href="/bowl-blank-calculator" className="underline">
          log to bowl blank calculator
        </Link>
        , or check species properties on the{" "}
        <Link href="/turning-wood-reference" className="underline">
          turning wood reference
        </Link>{" "}
        chart.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Frequently asked questions</h2>
        <dl className="mt-3 space-y-4">
          {FAQ.map((item) => (
            <div key={item.question}>
              <dt className="font-medium text-gray-900">{item.question}</dt>
              <dd className="mt-1 text-gray-600">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
