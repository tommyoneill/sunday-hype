import { TRPCError } from "@trpc/server";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";

import { env } from "~/env";
import {
  CALENDAR_DATE_REGEX,
  calendarDateStringToUtcDate,
  formatLectserveDateFromCalendarString,
} from "~/utils/lectionary-date";
import { parseLectserveResponse, type LectserveResponse } from "~/utils/lectserve-parse";
import { getUpcomingSundays } from "~/utils/upcoming-sundays";

import { getOpenAI } from "../../openai";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const lectionaryRouter = createTRPCRouter({
  getUpcomingSundays: publicProcedure.query(() => getUpcomingSundays(new Date())),

  getReadings: publicProcedure
    .input(
      z.object({
        date: z.string().regex(CALENDAR_DATE_REGEX, { message: "Expected calendar date YYYY-MM-DD." }),
      }),
    )
    .query(async ({ ctx, input }) => {
      let dbDate;
      try {
        dbDate = calendarDateStringToUtcDate(input.date);
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid calendar date." });
      }

      const existingReading = await ctx.db.lectionaryReading.findUnique({
        where: { date: dbDate },
      });

      if (existingReading) {
        return existingReading;
      }

      const urlSlug = formatLectserveDateFromCalendarString(input.date);
      let response;
      try {
        response = await fetch(`https://www.lectserve.com/date/${urlSlug}`);
      } catch (error) {
        if (env.NODE_ENV === "development") {
          console.error("[lectionary] Lectserve fetch failed:", error);
        }
        throw new TRPCError({
          code: "BAD_GATEWAY",
          message: "Could not reach the lectionary service. Try again shortly.",
        });
      }

      if (!response.ok) {
        if (env.NODE_ENV === "development") {
          console.error("[lectionary] Lectserve HTTP", response.status);
        }
        throw new TRPCError({
          code: "BAD_GATEWAY",
          message: `Lectionary service error (${response.status}). Try again later.`,
        });
      }

      let data: LectserveResponse;
      try {
        data = (await response.json()) as LectserveResponse;
      } catch (error) {
        if (env.NODE_ENV === "development") {
          console.error("[lectionary] Invalid JSON from Lectserve:", error);
        }
        throw new TRPCError({
          code: "BAD_GATEWAY",
          message: "Invalid response from the lectionary service.",
        });
      }

      if (env.NODE_ENV === "development") {
        const keys = Object.keys(data ?? {}).join(", ");
        console.log("[lectionary] Lectserve payload keys:", keys);
      }

      const parsed = parseLectserveResponse(data);

      if (!parsed.ok) {
        const message =
          parsed.code === "empty_readings"
            ? "No readings are listed for this date yet. Try another date."
            : "Readings are not available for this date.";
        throw new TRPCError({ code: "NOT_FOUND", message });
      }

      const { weekName, firstReading, psalm, epistle, gospel } = parsed;

      const userPrompt = `Please explain these Bible readings to a teenager:

First Reading: ${firstReading}
Psalm: ${psalm}
Second Reading / Epistle: ${epistle}
Gospel: ${gospel}`;

      const systemPrompt = await fs.readFile(
        path.join(process.cwd(), "src/server/prompts/teen-interpretation.md"),
        "utf-8",
      );

      let interpretation: string | null;
      try {
        const chatResponse = await getOpenAI().chat.completions.create({
          model: env.OPENAI_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 750,
          top_p: 0.9,
          frequency_penalty: 0.5,
          presence_penalty: 0.5,
        });
        interpretation = chatResponse.choices[0]?.message.content ?? "";
      } catch (error) {
        if (env.NODE_ENV === "development") {
          console.error("[lectionary] OpenAI completion failed:", error);
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not generate the interpretation right now. Please try again.",
        });
      }

      if (!interpretation?.trim()) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Interpretation came back empty. Please try again.",
        });
      }

      const newReading = await ctx.db.lectionaryReading.create({
        data: {
          date: dbDate,
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
