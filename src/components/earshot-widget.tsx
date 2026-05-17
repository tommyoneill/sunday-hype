"use client";

import Script from "next/script";
import { useCallback, useRef } from "react";

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

type EarshotWidgetProps = {
  projectId: string;
  apiKey: string;
};

export function EarshotWidget({ projectId, apiKey }: EarshotWidgetProps) {
  const didInit = useRef(false);

  const onScriptReady = useCallback(() => {
    if (didInit.current || typeof window === "undefined" || !window.Earshot) {
      return;
    }
    didInit.current = true;
    window.Earshot.init({ projectId, apiKey });
  }, [projectId, apiKey]);

  return (
    <Script
      src="https://cdn.earshotbot.com/v1/earshot.iife.js"
      strategy="afterInteractive"
      onLoad={onScriptReady}
    />
  );
}
