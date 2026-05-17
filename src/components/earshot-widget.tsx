"use client";

import { useEffect, useRef } from "react";

const EARSHOT_SCRIPT_SRC = "https://cdn.earshotbot.com/v1/earshot.iife.js";
const LOADER_MARK = "data-earshot-loader";

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
    const maxFrames = 120;

    const tryInit = (): boolean => {
      const api = window.Earshot;
      const init = api?.init;
      if (typeof init !== "function") {
        return false;
      }
      if (!earshotInitialized) {
        earshotInitialized = true;
        init.call(api, propsRef.current);
      }
      return true;
    };

    let framesLeft = maxFrames;
    const poll = () => {
      if (cancelled) {
        return;
      }
      if (tryInit()) {
        return;
      }
      framesLeft -= 1;
      if (framesLeft <= 0) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[Earshot] Timed out waiting for window.Earshot.init after loading",
            EARSHOT_SCRIPT_SRC,
            "- check Network tab (blocked?) and that the script URL is reachable.",
          );
        }
        return;
      }
      requestAnimationFrame(poll);
    };

    const startPolling = () => requestAnimationFrame(poll);

    let script = document.querySelector(`script[${LOADER_MARK}="1"]`) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.src = EARSHOT_SCRIPT_SRC;
      script.async = true;
      script.setAttribute(LOADER_MARK, "1");
      script.onload = startPolling;
      script.onerror = () => {
        if (process.env.NODE_ENV === "development") {
          console.error("[Earshot] Script failed to load:", EARSHOT_SCRIPT_SRC);
        }
      };
      document.head.appendChild(script);
      // Sync/cache loads can execute before `onload`; microtask catches that edge case.
      queueMicrotask(startPolling);
    } else {
      // Strict Mode remount: script already injected, keep polling for `init`.
      startPolling();
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
