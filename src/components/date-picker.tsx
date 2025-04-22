"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface DatePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  upcomingSundays: Date[];
}

export function DatePicker({ selectedDate, onDateChange, upcomingSundays }: DatePickerProps) {
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [customMonth, setCustomMonth] = useState(new Date());

  // Helper function to create a date without timezone issues
  function createLocalDate(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return new Date(year, month, day);
  }

  // Helper function to get all Sundays in a month
  function getSundaysInMonth(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const sundays = [];
    
    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    
    // Find the first Sunday
    let currentDate = new Date(firstDay);
    while (currentDate.getDay() !== 0) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Add all Sundays in the month
    while (currentDate.getMonth() === month) {
      sundays.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    return sundays;
  }

  // Helper function to format month and year
  function formatMonthYear(date: Date) {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }

  // Helper function to navigate to previous month
  function goToPreviousMonth() {
    const newDate = new Date(customMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCustomMonth(newDate);
  }

  // Helper function to navigate to next month
  function goToNextMonth() {
    const newDate = new Date(customMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCustomMonth(newDate);
  }

  const sundaysInMonth = getSundaysInMonth(customMonth);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-lg font-semibold text-white">Select a Sunday:</label>
        <div className="flex flex-wrap gap-2">
          {upcomingSundays.map((date) => (
            <button
              key={date.toISOString()}
              onClick={() => {
                onDateChange(createLocalDate(date));
                setShowCustomDate(false);
              }}
              className={`rounded-lg px-4 py-2 transition-colors ${
                selectedDate?.toDateString() === date.toDateString()
                  ? "bg-[hsl(280,100%,70%)] text-white"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </button>
          ))}
        </div>
        
        <div className="mt-4">
          <button
            onClick={() => setShowCustomDate(!showCustomDate)}
            className="rounded-lg bg-white/10 px-4 py-2 text-white hover:bg-white/20"
          >
            {showCustomDate ? "Hide Custom Date" : "Pick a Custom Date"}
          </button>
          
          {showCustomDate && (
            <div className="mt-4 rounded-lg bg-white/10 p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={goToPreviousMonth}
                  className="rounded-lg bg-white/10 px-3 py-1 text-white hover:bg-white/20"
                >
                  ←
                </button>
                <span className="text-lg font-semibold text-white">{formatMonthYear(customMonth)}</span>
                <button
                  onClick={goToNextMonth}
                  className="rounded-lg bg-white/10 px-3 py-1 text-white hover:bg-white/20"
                >
                  →
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {sundaysInMonth.map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => onDateChange(createLocalDate(date))}
                    className={`rounded-lg px-4 py-2 text-left transition-colors ${
                      selectedDate?.toDateString() === date.toDateString()
                        ? "bg-[hsl(280,100%,70%)] text-white"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    {date.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 