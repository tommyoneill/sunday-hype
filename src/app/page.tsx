"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { api } from "~/trpc/react";
import { DatePicker } from "~/components/date-picker";
import { ReadingsDisplay } from "~/components/readings-display";
import { Loading } from "~/components/loading";
import { trackReadingView, trackNavigation, trackSearch, trackFilter, trackEngagement } from "~/utils/analytics";

// Helper function to create a date without timezone issues
function createLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return new Date(year, month, day);
}

// Helper function to get upcoming Sundays
function getUpcomingSundays() {
  const sundays = [];
  const today = createLocalDate(new Date());
  
  // Get the next 4 Sundays
  for (let i = 0; i < 4; i++) {
    const nextSunday = new Date(today);
    // Set to next Sunday
    nextSunday.setDate(today.getDate() + ((7 - today.getDay()) % 7) + (i * 7));
    sundays.push(createLocalDate(nextSunday));
  }
  
  return sundays;
}

export default function Home() {
  const upcomingSundays = getUpcomingSundays();
  const defaultDate = upcomingSundays[0] ?? createLocalDate(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(defaultDate);
  const [previousPath, setPreviousPath] = useState<string>("");
  const currentPath = usePathname();
  
  const { data: readings, isLoading, error } = api.lectionary.getReadings.useQuery(
    { date: selectedDate ?? defaultDate },
    { enabled: true }
  );

  // Track reading view when a reading is loaded
  useEffect(() => {
    if (readings) {
      trackReadingView(readings.id.toString(), "lectionary");
    }
  }, [readings]);

  // Track navigation
  useEffect(() => {
    if (previousPath && currentPath) {
      trackNavigation(previousPath, currentPath);
      setPreviousPath(currentPath);
    }
  }, [currentPath, previousPath]);

  // Track search
  const handleSearch = (query: string) => {
    // Implement search functionality here
    const searchResults = []; // Placeholder for search results
    trackSearch(query, searchResults.length);
  };

  // Track filter changes
  const handleFilter = (filterType: string, value: string) => {
    // Implement filter functionality here
    trackFilter(filterType, value);
  };

  // Track user engagement
  const handleEngagement = (action: string, readingId: string) => {
    // Implement engagement functionality here
    trackEngagement(action, readingId);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Sunday <span className="text-[hsl(280,100%,70%)]">Hype</span>
        </h1>
        <div className="flex flex-col gap-8 w-full max-w-2xl">
          <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4">
            <h3 className="text-2xl font-bold">Select Date</h3>
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              upcomingSundays={upcomingSundays}
            />
          </div>
          
          <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4">
            <h3 className="text-2xl font-bold">Readings</h3>
            {isLoading ? (
              <div className="mt-8 w-full rounded-lg bg-white/10 p-6">
                <Loading />
              </div>
            ) : error ? (
              <div className="mt-8 w-full rounded-lg bg-white/10 p-6">
                <p className="text-lg text-red-400">Error loading readings. Please try again later.</p>
              </div>
            ) : readings ? (
              <ReadingsDisplay readings={readings} isLoading={isLoading} />
            ) : (
              <div className="mt-8 w-full rounded-lg bg-white/10 p-6">
                <p className="text-lg">No readings available for this date. Please try another date.</p>
              </div>
            )}
          </div>
        </div>
        
        <footer className="mt-8 text-center text-sm text-gray-400">
          <p>Made with ❤️ by <a 
            href="https://www.linkedin.com/in/tomoneill/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[hsl(280,100%,70%)] hover:underline"
          >
            Tommy ONeill
          </a></p>
          <p className="mt-2">Readings provided by <a 
            href="https://www.lectserve.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[hsl(280,100%,70%)] hover:underline"
          >
            Lectserve
          </a></p>
        </footer>
      </div>
    </main>
  );
}
