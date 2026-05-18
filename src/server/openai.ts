import OpenAI from "openai";

import { env } from "~/env";

let client: OpenAI | undefined;

/**
 * Lazily construct the SDK client so `next build` can complete when env validation is skipped
 * and secrets are absent (instantiation happens on first AI request only).
 */
export function getOpenAI(): OpenAI {
  client ??= new OpenAI({ apiKey: env.OPENAI_API_KEY });
  return client;
}
