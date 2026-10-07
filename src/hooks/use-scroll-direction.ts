import { useEffect, useState } from "react";

const THRESHOLD = 4;

export function useScrollingDown() {
  const [scrollingDown, setScrollingDown] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < THRESHOLD) return;
      setScrollingDown(delta > 0 && y > 0);
      lastY = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return scrollingDown;
}
