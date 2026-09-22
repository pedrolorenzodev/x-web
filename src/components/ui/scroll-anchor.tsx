"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function ScrollAnchor({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ block: "start" });
  }, []);

  return <div ref={ref} aria-hidden className={cn("h-0", className)} />;
}
