"use client";

export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative h-12 w-12">
        <div className="absolute h-full w-full animate-spin rounded-full border-4 border-[hsl(280,100%,70%)] border-t-transparent"></div>
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(280,100%,70%)]"></div>
      </div>
      <p className="text-lg text-gray-300">Getting your readings ready...</p>
    </div>
  );
} 