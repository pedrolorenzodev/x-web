"use client";

import { useId, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  ARTWORK_CENTER_X,
  ARTWORK_CENTER_Y,
  ARTWORK_HEIGHT,
  ARTWORK_WIDTH,
  useArtworkHighlight,
} from "@/features/auth/hooks/use-artwork-highlight";

const X_PATH =
  "M285.38 207.711L462.954 1.5H420.874L266.687 180.55L143.538 1.5H1.50003L187.726 272.256L1.50003 488.5H43.5818L206.408 299.417L336.462 488.5H478.5L285.37 207.711H285.38ZM227.743 274.641L208.875 247.68L58.7444 33.147H123.379L244.536 206.282L263.405 233.243L420.894 458.292H356.259L227.743 274.652V274.641Z";

type XArtworkProps = {
  tiny?: boolean;
  strokeWidth?: number;
};

export function XArtwork({ tiny = false, strokeWidth = 3 }: XArtworkProps) {
  const gradientRef = useRef<SVGRadialGradientElement>(null);
  const gradientId = useId();
  useArtworkHighlight(gradientRef);

  return (
    <svg
      role="img"
      aria-label="X"
      fill="none"
      viewBox={`0 0 ${ARTWORK_WIDTH} ${ARTWORK_HEIGHT}`}
      className={cn("h-auto w-full", tiny ? "max-w-[140px]" : "max-w-[480px]")}
    >
      <defs>
        <radialGradient
          ref={gradientRef}
          id={gradientId}
          cx={ARTWORK_CENTER_X}
          cy={ARTWORK_CENTER_Y}
          r="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#5f5f5f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={X_PATH} fill="black" />
      <path
        d={X_PATH}
        stroke="#222222"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d={X_PATH}
        stroke={`url(#${gradientId})`}
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
