"use client";

import type { LectionaryReading } from "@prisma/client";
import { Loading } from "./loading";
import ReactMarkdown from "react-markdown";
import { trackReadingShare } from "~/utils/analytics";

// Type for readings that come directly from the API (without DB fields)
type APIReading = {
  date: Date;
  firstReading: string;
  psalm: string;
  epistle: string;
  gospel: string;
  weekName: string;
  interpretation: string | null;
};

interface ReadingsDisplayProps {
  readings: LectionaryReading | APIReading | null;
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

function ShareButton({ platform, onClick }: { platform: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
    >
      Share on {platform}
    </button>
  );
}

export function ReadingsDisplay({ readings, isLoading }: ReadingsDisplayProps) {
  const handleShare = (platform: string) => {
    const shareText = `Check out this week's readings: ${readings?.weekName}\n\nFirst Reading: ${readings?.firstReading}\nPsalm: ${readings?.psalm}\nEpistle: ${readings?.epistle}\nGospel: ${readings?.gospel}\n\nShared via Sunday Hype`;
    
    if (platform === 'twitter') {
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      window.open(url, '_blank');
    } else if (platform === 'facebook') {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
      window.open(url, '_blank');
    } else if (platform === 'whatsapp') {
      const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(url, '_blank');
    }
    
    if (readings && 'id' in readings) {
      trackReadingShare(readings.id.toString(), platform);
    }
  };

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
          <h3 className="mb-4 text-xl font-semibold text-[hsl(280,100%,70%)]">
            About Mass:
          </h3>
          <div className="prose prose-invert max-w-none prose-p:my-3">
            <ReactMarkdown>{readings.interpretation ?? ""}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
} 