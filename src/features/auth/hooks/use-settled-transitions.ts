import { useEffect, useState } from "react";

export function useSettledTransitions(skipFirstFrame: boolean) {
  const [settled, setSettled] = useState(!skipFirstFrame);

  useEffect(() => {
    if (settled) return;
    const frame = requestAnimationFrame(() => setSettled(true));
    return () => cancelAnimationFrame(frame);
  }, [settled]);

  return settled;
}
