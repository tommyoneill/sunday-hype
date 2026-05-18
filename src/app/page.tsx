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
  const upcomingSundays = getUpcomingSundays(new Date());
  const defaultDate = upcomingSundays[0] ?? new Date();

  const [selectedDate, setSelectedDate] = useState<Date | null>(defaultDate);

  const queryDate =
    selectedDate !== null ? dateToCalendarDateString(selectedDate) : dateToCalendarDateString(defaultDate);

  const {
    data: readings,
    isLoading,
    error: queryError,
  } = api.lectionary.getReadings.useQuery({
    date: queryDate,
  });

  useEffect(() => {
    if (selectedDate) {
      trackDateSelected(dateToCalendarDateString(selectedDate));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (readings) {
      trackReadingView(readings.id.toString(), "lectionary");
    }
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
