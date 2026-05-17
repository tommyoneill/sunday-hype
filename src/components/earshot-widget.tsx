"use client";

import { useEffect, useRef } from "react";

const EARSHOT_SCRIPT_SRC = "https://cdn.earshotbot.com/v1/earshot.iife.js";

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

/** Survives React Strict Mode double-mount so we only init once per session. */
let earshotInitialized = false;

type EarshotWidgetProps = {
  projectId: string;
  apiKey: string;
};

export function EarshotWidget({ projectId, apiKey }: EarshotWidgetProps) {
  const propsRef = useRef({ projectId, apiKey });
  propsRef.current = { projectId, apiKey };

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    let cancelled = false;

    const script = document.createElement("script");
    script.src = EARSHOT_SCRIPT_SRC;
    script.async = true;
    script.onload = () => {
      if (cancelled || earshotInitialized) {
        return;
      }
      const { init } = window.Earshot ?? {};
      if (typeof init !== "function") {
        return;
      }
      earshotInitialized = true;
      init.call(window.Earshot, propsRef.current);
    };

    document.head.appendChild(script);

    return () => {
      cancelled = true;
      script.remove();
    };
  }, []);

  return null;
}
