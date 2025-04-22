import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { promises as fs } from "fs";
import path from "path";
import { openai } from "../../openai";

interface LectserveResponse {
  red_letter?: {
    services?: Array<{
      name?: string;
      readings?: string[];
    }>;
  };
}

export const lectionaryRouter = createTRPCRouter({
  getUpcomingSundays: publicProcedure
    .query(async () => {
      const today = new Date();
      const upcomingSundays = [];
      
      // Get the next 4 Sundays
      for (let i = 0; i < 4; i++) {
        const nextSunday = new Date(today);
        // Set to next Sunday
        nextSunday.setDate(today.getDate() + ((7 - today.getDay()) % 7) + (i * 7));
        upcomingSundays.push(nextSunday);
      }
      
      return upcomingSundays;
    }),

  getReadings: publicProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ ctx, input }) => {
      // First check if we already have the readings and interpretation
      const existingReading = await ctx.db.lectionaryReading.findUnique({
        where: { date: input.date },
      });

      if (existingReading) {
        return existingReading;
      }

      // Fetch from Lectserve API
      const response = await fetch(`https://www.lectserve.com/date/${input.date.toISOString().split('T')[0]}`);
      const data = (await response.json()) as LectserveResponse;

      console.log('Lectserve API Response:', JSON.stringify(data, null, 2));

      if (!data?.red_letter?.services?.[0]) {
        console.log('Invalid API response structure:', {
          hasRedLetter: !!data?.red_letter,
          hasServices: !!data?.red_letter?.services,
          hasFirstService: !!data?.red_letter?.services?.[0],
        });
        // Create a database entry with placeholder text for unavailable readings
        const placeholderReading = await ctx.db.lectionaryReading.create({
          data: {
            date: input.date,
            firstReading: "No readings available for this date",
            psalm: "No readings available for this date",
            epistle: "No readings available for this date",
            gospel: "No readings available for this date",
            weekName: "No readings available",
            interpretation: "No readings are available for this date. Please try another date.",
          },
        });
        return placeholderReading;
      }

      const service = data.red_letter.services[0];
      const readings = service.readings ?? [];
      const weekName = service.name ?? "Unknown Week";

      console.log('Service data:', {
        readings,
        weekName,
        serviceName: service.name,
      });

      // If no readings are available, create a database entry with placeholder text
      if (readings.length === 0) {
        const placeholderReading = await ctx.db.lectionaryReading.create({
          data: {
            date: input.date,
            firstReading: "No readings available for this date",
            psalm: "No readings available for this date",
            epistle: "No readings available for this date",
            gospel: "No readings available for this date",
            weekName: weekName,
            interpretation: "No readings are available for this date. Please try another date.",
          },
        });
        return placeholderReading;
      }
      
      // Ensure we have all required readings
      const firstReading = readings[0] ?? "No readings available for this date";
      const psalm = readings[1] ?? "No readings available for this date";
      const epistle = readings[2] ?? "No readings available for this date";
      const gospel = readings[3] ?? "No readings available for this date";
      
      // Generate teenage-friendly interpretation
      const prompt = `Please explain these Bible readings to a teenager:
         
      First Reading: ${firstReading}
      Psalm: ${psalm}
      Gospel: ${gospel}`;

      const systemPrompt = await fs.readFile(
        path.join(process.cwd(), "src/server/prompts/teen-interpretation.md"),
        "utf-8"
      );

      const chatResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },          
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 750,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      });

      const interpretation = chatResponse.choices[0]?.message.content ?? "";

      // Store in database
      const newReading = await ctx.db.lectionaryReading.create({
        data: {
          date: input.date,
          firstReading,
          psalm,
          epistle,
          gospel,
          weekName,
          interpretation,
        },
      });

      return newReading;
    }),
}); 