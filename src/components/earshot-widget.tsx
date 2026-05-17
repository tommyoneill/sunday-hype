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

declare global {
  interface Window {
    Earshot?: {
      init: (options: EarshotInitOptions) => void;
      identify: (identity: Record<string, unknown>) => void;
      reset: () => void;
      open: () => void;
    };
  }
}

let earshotInitialized = false;

type EarshotWidgetProps = {
  projectId: string;
  apiKey: string;
};

/**
 * Loads the Earshot IIFE once, then polls until `window.Earshot.init` exists so we never run init
 * before the bundle finishes (Next.js / Strict Mode safe).
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
      const api = window.Earshot;
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
          "[Earshot] Timed out waiting for window.Earshot.init after the script loaded.",
          "Open the console on mobile emulation too — if you see this, try a hard refresh or check for extensions blocking JS.",
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
