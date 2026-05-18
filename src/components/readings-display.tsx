"use client";

import ReactMarkdown from "react-markdown";

import type { RouterOutputs } from "~/trpc/react";

import { Loading } from "./loading";

type LectionaryReadings = RouterOutputs["lectionary"]["getReadings"];

interface ReadingsDisplayProps {
  readings: LectionaryReadings | null;
  isLoading: boolean;
}

function ReadingSection({ title, content }: { title: string; content: string }) {
  return (
    <div className="mb-4">
      <span className="font-semibold text-[hsl(280,100%,70%)] text-lg">{title}: </span>
      <span className="text-white/90">{content}</span>
    </div>
  );
}

export function ReadingsDisplay({ readings, isLoading }: ReadingsDisplayProps) {
  if (isLoading) {
    return (
      <div className="mt-8 w-full max-w-2xl rounded-lg bg-white/10 p-6">
        <Loading />
      </div>
    );
  }

  if (!readings) {
    return null;
  }

  return (
    <div className="mt-8 w-full max-w-2xl rounded-lg bg-white/10 p-6">
      <h2 className="mb-8 text-2xl font-bold">{readings.weekName}</h2>

      <div className="space-y-8">
        <ReadingSection title="First Reading" content={readings.firstReading} />
        <ReadingSection title="Psalm" content={readings.psalm} />
        <ReadingSection title="Epistle" content={readings.epistle} />
        <ReadingSection title="Gospel" content={readings.gospel} />

        <div className="mt-8">
          <h3 className="mb-4 text-xl font-semibold text-[hsl(280,100%,70%)]">About Mass:</h3>
          <div className="prose prose-invert max-w-none prose-p:my-3">
            <ReactMarkdown>{readings.interpretation ?? ""}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
