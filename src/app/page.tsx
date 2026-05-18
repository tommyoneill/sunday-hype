"use client";

import { useEffect, useState } from "react";

import { DatePicker } from "~/components/date-picker";
import { Loading } from "~/components/loading";
import { ReadingsDisplay } from "~/components/readings-display";
import { api } from "~/trpc/react";
import { trackDateSelected, trackReadingView } from "~/utils/analytics";
import { dateToCalendarDateString } from "~/utils/lectionary-date";
import { getUpcomingSundays } from "~/utils/upcoming-sundays";

export default function Home() {
  /**
   * Sunday lists and `toLocaleDateString()` depend on the runtime timezone. The SSR shell often runs
   * in UTC (e.g. Vercel) while the browser uses the visitor's zone, which would hydrate-mismatch
   * button labels and query inputs — React #418. Initialize calendar state after mount instead.
   */
  const [datesReady, setDatesReady] = useState(false);
  const [upcomingSundays, setUpcomingSundays] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const upcoming = getUpcomingSundays(new Date());
    setUpcomingSundays(upcoming);
    setSelectedDate(upcoming[0] ?? new Date());
    setDatesReady(true);
  }, []);

  const queryDate =
    selectedDate !== null ? dateToCalendarDateString(selectedDate) : "";

  const {
    data: readings,
    isLoading,
    error: queryError,
  } = api.lectionary.getReadings.useQuery(
    { date: queryDate },
    { enabled: datesReady && queryDate.length > 0 },
  );

  useEffect(() => {
    if (!datesReady || !selectedDate) return;
    trackDateSelected(dateToCalendarDateString(selectedDate));
  }, [datesReady, selectedDate]);

  useEffect(() => {
    if (!readings) return;
    trackReadingView(readings.id.toString(), "lectionary");
  }, [readings]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Sunday <span className="text-[hsl(280,100%,70%)]">Hype</span>
        </h1>
        <div className="flex w-full max-w-2xl flex-col gap-8">
          <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4">
            <h3 className="text-2xl font-bold">Select Date</h3>
            {datesReady ? (
              <DatePicker
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                upcomingSundays={upcomingSundays}
              />
            ) : (
              <div className="rounded-lg bg-white/5 py-10">
                <Loading />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4">
            <h3 className="text-2xl font-bold">Readings</h3>
            {!datesReady || isLoading ? (
              <div className="mt-8 w-full rounded-lg bg-white/10 p-6">
                <Loading />
              </div>
            ) : queryError ? (
              <div className="mt-8 w-full rounded-lg bg-white/10 p-6">
                <p className="text-lg text-red-400">
                  {queryError.message || "Couldn't load readings. Please try again later."}
                </p>
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
          <p>
            Made with ❤️ by{" "}
            <a
              href="https://www.linkedin.com/in/tomoneill/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[hsl(280,100%,70%)] hover:underline"
            >
              Tommy ONeill
            </a>
          </p>
          <p className="mt-2">
            Readings provided by{" "}
            <a
              href="https://www.lectserve.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[hsl(280,100%,70%)] hover:underline"
            >
              Lectserve
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
