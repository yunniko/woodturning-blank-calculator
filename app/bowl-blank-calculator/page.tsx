import type { Metadata } from "next";
import Link from "next/link";
import { BowlBlankTool } from "../_components/bowl-blank-tool";
import { JsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Log to Bowl Blank Calculator",
  description:
    "Free calculator: enter a log's diameter and length to estimate how many bowl blanks it will yield and the maximum bowl size each one supports. No signup, nothing uploaded.",
};

const FAQ = [
  {
    question: "Why subtract a bark/waney-edge trim from the log diameter?",
    answer:
      "The bark and the often-checked or unstable outer sapwood layer usually get trimmed off before or during rough turning, so the diameter you can actually use is smaller than the log's over-bark measurement. Adjust the default to match how much you typically lose on your own logs.",
  },
  {
    question: "Why does the max bowl diameter subtract a truing allowance?",
    answer:
      "A cross-cut disk isn't a perfect circle, and its edge is often checked (cracked). Woodworking guidance commonly suggests cutting your blank 2-4in larger than the bowl you actually want, to leave room to true it round and cut past surface checking. This tool defaults to 2in (the low end of that range) and lets you raise it.",
  },
  {
    question: "Does this account for the pith?",
    answer:
      "Not directly, and it's important to know before you cut: for most logs, the dominant, recommended practice is to split the log lengthwise through the pith first (e.g. with a chainsaw or on a bandsaw), then bandsaw a round blank from each half — this excludes the pith entirely and is far more reliable against cracking, typically yielding two blanks per section rather than one. The full cross-cut-disk model this calculator computes (one blank centered on the pith) is a narrower alternative, mainly suited to shallow platters or logs much wider than the bowl you want, where the pith can sit safely off to one side or be cut away separately. If you're working a typical log for a typical bowl, plan to split through the pith rather than relying on this tool's disk-count math directly.",
  },
  {
    question: "What if my log is much wider than the bowl I want?",
    answer:
      "This tool only estimates one blank per cross-cut disk. An experienced turner can rip extra blanks from the material surrounding a central disk (for example on a bandsaw) to get more yield from a wide log — that 2-D layout problem is outside this tool's scope.",
  },
  {
    question: "What should I do with the blanks before turning them?",
    answer:
      "Seal the end grain (and the whole outer surface, if you won't rough-turn right away) with a commercial end-sealer like Anchorseal, or a heavy coat of latex paint or wax as a lower-cost substitute. End grain loses moisture far faster than side grain, and an unsealed blank can develop cracks within days, especially in warm or dry conditions. Store sealed blanks somewhere cool and out of direct sun until you're ready to rough-turn.",
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

      <h1 className="text-3xl font-semibold">Log to Bowl Blank Calculator</h1>
      <p className="mt-3 text-gray-600">
        Enter a log&apos;s diameter and usable length to estimate how many
        bowl blanks it will yield, and the largest bowl each blank can turn
        into.
      </p>

      <div className="mt-6">
        <BowlBlankTool />
      </div>

      <p className="mt-8 text-sm text-gray-500">
        Picking a species? Check the{" "}
        <Link href="/turning-wood-reference" className="underline">
          turning wood reference
        </Link>{" "}
        chart, then use the{" "}
        <Link href="/rough-out-drying-calculator" className="underline">
          rough-out &amp; drying calculator
        </Link>{" "}
        once you know your blank size.
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
