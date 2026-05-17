"use client";

import { useEffect, useRef } from "react";

const EARSHOT_SCRIPT_SRC = "https://cdn.earshotbot.com/v1/earshot.iife.js";
const LOADER_MARK = "data-earshot-loader";
/** ~10s at 60fps — parsing/eval of the IIFE on slow mobile must fit before we give up */
const MAX_POLL_FRAMES = 600;

type EarshotInitOptions = {
  projectId: string;
  apiKey: string;
  apiUrl?: string;
  position?: "bottom-right" | "bottom-left" | "top-right";
  primaryColor?: string;
};

type EarshotApi = {
  init: (options: EarshotInitOptions) => void;
  identify: (identity: Record<string, unknown>) => void;
  reset: () => void;
  open: () => void;
};

/** CDN IIFE can expose the flat API on `window.Earshot` or as ESM interop (`default` / nested `Earshot`). */
function resolveEarshotApi(): EarshotApi | null {
  const root = window.Earshot as unknown;
  if (!root || typeof root !== "object") {
    return null;
  }
  const r = root as Record<string, unknown>;
  const pick = (o: unknown): EarshotApi | null => {
    if (!o || typeof o !== "object") {
      return null;
    }
    const x = o as Record<string, unknown>;
    if (typeof x.init === "function") {
      return o as EarshotApi;
    }
    return null;
  };
  return pick(r) ?? pick(r.default) ?? pick(r.Earshot);
}

declare global {
  interface Window {
    /** Present after `earshot.iife.js` loads; shape may be flat API or `{ default, Earshot, __esModule }`. */
    Earshot?: EarshotApi | Record<string, unknown>;
  }
}

let earshotInitialized = false;

type EarshotWidgetProps = {
  projectId: string;
  apiKey: string;
};

/**
 * Loads the Earshot IIFE once, then polls until a usable API (`init`) exists on `window.Earshot`,
 * including ESM-shaped bundles (`default` / nested `Earshot`).
 */
export function EarshotWidget({ projectId, apiKey }: EarshotWidgetProps) {
  const propsRef = useRef({ projectId, apiKey });
  propsRef.current = { projectId, apiKey };

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    let cancelled = false;
    let framesLeft = MAX_POLL_FRAMES;
    let rafId = 0;

    const tryInit = (): boolean => {
      const api = resolveEarshotApi();
      const init = api?.init;
      if (typeof init !== "function") {
        return false;
      }
      if (!earshotInitialized) {
        earshotInitialized = true;
        try {
          init.call(api, propsRef.current);
        } catch (err) {
          earshotInitialized = false;
          console.error("[Earshot] init() threw — widget will not appear:", err);
        }
      }
      return true;
    };

    const poll = () => {
      if (cancelled) {
        return;
      }
      if (tryInit()) {
        return;
      }
      framesLeft -= 1;
      if (framesLeft <= 0) {
        console.warn(
          "[Earshot] Timed out waiting for a usable Earshot API (init) after the script loaded.",
          "Open DevTools → Console on real Chrome if this persists.",
        );
        return;
      }
      rafId = requestAnimationFrame(poll);
    };

    /** Fresh frame budget so we never reuse an exhausted counter after slow network/cache parse */
    const startPolling = () => {
      if (cancelled) {
        return;
      }
      framesLeft = MAX_POLL_FRAMES;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(poll);
    };

    let script = document.querySelector<HTMLScriptElement>(`script[${LOADER_MARK}="1"]`);

    if (!script) {
      script = document.createElement("script");
      script.src = EARSHOT_SCRIPT_SRC;
      script.async = true;
      script.setAttribute(LOADER_MARK, "1");
      script.onload = () => startPolling();
      script.onerror = () => {
        console.error("[Earshot] Script failed to load:", EARSHOT_SCRIPT_SRC);
      };
      document.head.appendChild(script);
      // Sync/cache eval can expose Earshot before `load` fires — try once without burning the poll budget.
      queueMicrotask(() => {
        if (!cancelled) {
          void tryInit();
        }
      });
    } else {
      startPolling();
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
