export type FloatingSide = "top" | "bottom";

export type FloatingPosition = {
  top: number;
  left: number;
  side: FloatingSide;
};

const VIEWPORT_MARGIN = 8;

export function placeBelowCentered(
  anchor: DOMRect,
  floating: { width: number; height: number },
  gap: number,
): FloatingPosition {
  const fitsBelow =
    anchor.bottom + gap + floating.height <=
    window.innerHeight - VIEWPORT_MARGIN;
  const fitsAbove = anchor.top - gap - floating.height >= VIEWPORT_MARGIN;
  const side: FloatingSide = fitsBelow || !fitsAbove ? "bottom" : "top";
  const top =
    side === "bottom"
      ? anchor.bottom + gap
      : anchor.top - gap - floating.height;
  const centered = anchor.left + anchor.width / 2 - floating.width / 2;
  const maxLeft = window.innerWidth - VIEWPORT_MARGIN - floating.width;
  const left = Math.max(VIEWPORT_MARGIN, Math.min(centered, maxLeft));
  return { top, left, side };
}

export function insetRect(rect: DOMRect, inset: number) {
  return new DOMRect(
    rect.x + inset,
    rect.y + inset,
    rect.width - inset * 2,
    rect.height - inset * 2,
  );
}
