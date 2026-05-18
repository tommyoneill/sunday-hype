/** Shape returned by Lectserve for Sunday / red-letter lookups. */

export interface LectserveResponse {
  red_letter?: {
    services?: Array<{
      name?: string;
      readings?: string[];
    }>;
  };
}

const NO_TEXT = "No readings available for this date";

export type ParseLectserveFailureCode = "missing_service" | "empty_readings";

export type ParseLectserveResult =
  | { ok: true; weekName: string; firstReading: string; psalm: string; epistle: string; gospel: string }
  | { ok: false; code: ParseLectserveFailureCode };

/**
 * Validates Lectserve JSON and extracts the four-reading block used by Sunday Hype.
 */
export function parseLectserveResponse(data: LectserveResponse): ParseLectserveResult {
  const service = data?.red_letter?.services?.[0];

  if (!service) {
    return { ok: false, code: "missing_service" };
  }

  const readings = service.readings ?? [];
  const weekName = service.name ?? "Unknown Week";

  if (readings.length === 0) {
    return { ok: false, code: "empty_readings" };
  }

  const firstReading = readings[0] ?? NO_TEXT;
  const psalm = readings[1] ?? NO_TEXT;
  const epistle = readings[2] ?? NO_TEXT;
  const gospel = readings[3] ?? NO_TEXT;

  return {
    ok: true,
    weekName,
    firstReading,
    psalm,
    epistle,
    gospel,
  };
}
