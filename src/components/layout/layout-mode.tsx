"use client";

import { useLayoutEffect, useRef } from "react";

export type ShellLayoutMode = "no-panel" | "fullwidth";

export function LayoutMode({ mode }: { mode: ShellLayoutMode }) {
  const markerRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    marker.dataset.layoutMode = mode;
    return () => {
      delete marker.dataset.layoutMode;
    };
  }, [mode]);

  return <span ref={markerRef} hidden data-layout-mode={mode} />;
}
