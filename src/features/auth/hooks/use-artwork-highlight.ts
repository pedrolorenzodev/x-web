import { useEffect, type RefObject } from "react";

export const ARTWORK_WIDTH = 480;
export const ARTWORK_HEIGHT = 490;
export const ARTWORK_CENTER_X = ARTWORK_WIDTH / 2;
export const ARTWORK_CENTER_Y = ARTWORK_HEIGHT / 2;

const LERP = 0.08;
const ORBIT_RADIUS = 150;
const ORBIT_STEP = 0.008;
const TILT = (Math.PI / 180) * -15;
const IDLE_MS = 15000;
const PULL = 0.35;
const PULL_EASE = { x1: 0.7, y1: 0, x2: 1, y2: 1 };
const HOVER_EASE = { x1: 0, y1: 0, x2: 0.2, y2: 1 };
const HOVER_IN_MS = 800;
const HOVER_OUT_MS = 1500;

type CubicBezier = typeof PULL_EASE;

function cubicBezier({ x1, y1, x2, y2 }: CubicBezier, progress: number) {
  let t = progress;
  for (let i = 0; i < 8; i++) {
    const inverse = 1 - t;
    const x =
      3 * inverse * inverse * t * x1 + 3 * inverse * t * t * x2 + t * t * t;
    const slope =
      3 * inverse * inverse * x1 +
      6 * inverse * t * (x2 - x1) +
      3 * t * t * (1 - x2);
    if (Math.abs(slope) < 1e-6) break;
    t = Math.max(0, Math.min(1, t - (x - progress) / slope));
  }
  const inverse = 1 - t;
  return 3 * inverse * inverse * t * y1 + 3 * inverse * t * t * y2 + t * t * t;
}

export function useArtworkHighlight(
  gradientRef: RefObject<SVGRadialGradientElement | null>,
) {
  useEffect(() => {
    const gradient = gradientRef.current;
    const svg = gradient?.ownerSVGElement;
    if (!gradient || !svg) return;

    let frame: number | null = null;
    let x = ARTWORK_CENTER_X;
    let y = ARTWORK_CENTER_Y;
    let targetX = ARTWORK_CENTER_X;
    let targetY = ARTWORK_CENTER_Y;
    let lastMove = 0;
    let angle = 0;
    let orbiting = true;
    let onScreen = true;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    let pointer: { clientX: number; clientY: number } | null = null;
    let cursorX = ARTWORK_CENTER_X;
    let cursorY = ARTWORK_CENTER_Y;
    let hovering = false;
    let hoverMix = 0;
    let mixFrom = 0;
    let mixStart = 0;
    const canHover = window.matchMedia("(hover: hover)").matches;

    function start() {
      if (frame === null && onScreen) frame = requestAnimationFrame(tick);
    }

    function stop() {
      if (frame === null) return;
      cancelAnimationFrame(frame);
      frame = null;
    }

    function syncAngle() {
      const dx = x - ARTWORK_CENTER_X;
      const dy = y - ARTWORK_CENTER_Y;
      angle = Math.atan2(
        dy * Math.cos(-TILT) - dx * Math.sin(-TILT),
        dx * Math.cos(-TILT) + dy * Math.sin(-TILT),
      );
    }

    function handleScroll() {
      if (!pointer) return;
      trackCursor();
      start();
    }

    function handlePointerExit() {
      pointer = null;
      setHovering(false);
      resumeOrbit();
    }

    function resumeOrbit() {
      clearTimeout(idleTimer);
      orbiting = true;
      syncAngle();
      start();
    }

    function followPointer(clientX: number, clientY: number) {
      const pointerX = (clientX / window.innerWidth) * ARTWORK_WIDTH;
      const pointerY = (clientY / window.innerHeight) * ARTWORK_HEIGHT;
      const distance = Math.min(
        1,
        Math.hypot(
          (pointerX - ARTWORK_CENTER_X) / (ARTWORK_WIDTH / 2),
          (pointerY - ARTWORK_CENTER_Y) / (ARTWORK_HEIGHT / 2),
        ),
      );
      const pull = cubicBezier(PULL_EASE, distance) * PULL;
      targetX = pointerX + (ARTWORK_CENTER_X - pointerX) * pull;
      targetY = pointerY + (ARTWORK_CENTER_Y - pointerY) * pull;
    }

    function trackCursor() {
      if (!pointer || !svg) return;
      const { clientX, clientY } = pointer;
      const box = svg.getBoundingClientRect();
      const inside =
        box.width > 0 &&
        clientX >= box.left &&
        clientX <= box.right &&
        clientY >= box.top &&
        clientY <= box.bottom;
      const toArtwork = inside ? svg.getScreenCTM()?.inverse() : undefined;
      if (toArtwork) {
        const point = new DOMPoint(clientX, clientY).matrixTransform(toArtwork);
        cursorX = point.x;
        cursorY = point.y;
      }
      setHovering(inside);
    }

    function setHovering(next: boolean) {
      if (next === hovering) return;
      hovering = next;
      mixFrom = hoverMix;
      mixStart = performance.now();
    }

    function updateHoverMix() {
      const goal = hovering ? 1 : 0;
      if (hoverMix === goal) return false;
      const duration = hovering ? HOVER_IN_MS : HOVER_OUT_MS;
      const progress = Math.min(1, (performance.now() - mixStart) / duration);
      hoverMix = mixFrom + (goal - mixFrom) * cubicBezier(HOVER_EASE, progress);
      if (progress === 1) hoverMix = goal;
      return hoverMix !== goal;
    }

    function paint() {
      if (!(svg?.checkVisibility?.() ?? true)) return;
      gradient?.setAttribute("cx", String(x + (cursorX - x) * hoverMix));
      gradient?.setAttribute("cy", String(y + (cursorY - y) * hoverMix));
    }

    function tick() {
      if (!orbiting && Date.now() - lastMove > IDLE_MS) {
        orbiting = true;
        syncAngle();
      }
      if (orbiting) {
        angle += ORBIT_STEP;
        const orbitX = Math.cos(angle) * ORBIT_RADIUS;
        const orbitY = Math.sin(angle) * ORBIT_RADIUS;
        targetX =
          ARTWORK_CENTER_X + orbitX * Math.cos(TILT) - orbitY * Math.sin(TILT);
        targetY =
          ARTWORK_CENTER_Y + orbitX * Math.sin(TILT) + orbitY * Math.cos(TILT);
      }
      x += (targetX - x) * LERP;
      y += (targetY - y) * LERP;
      const mixing = updateHoverMix();
      paint();
      const settling =
        Math.abs(targetX - x) > 0.1 || Math.abs(targetY - y) > 0.1;
      frame =
        (orbiting || settling || mixing) && onScreen
          ? requestAnimationFrame(tick)
          : null;
    }

    function handleMouseMove(event: MouseEvent) {
      lastMove = Date.now();
      orbiting = false;
      followPointer(event.clientX, event.clientY);
      pointer = { clientX: event.clientX, clientY: event.clientY };
      trackCursor();
      if (hovering && hoverMix === 1) paint();
      start();
      clearTimeout(idleTimer);
      idleTimer = setTimeout(resumeOrbit, IDLE_MS);
    }

    const observer = new IntersectionObserver((entries) => {
      onScreen = entries[entries.length - 1]?.isIntersecting ?? true;
      if (onScreen) start();
      else stop();
    });
    observer.observe(svg);
    start();
    if (canHover) {
      document.body.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseleave", handlePointerExit);
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      clearTimeout(idleTimer);
      observer.disconnect();
      if (canHover) {
        document.body.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseleave", handlePointerExit);
        window.removeEventListener("scroll", handleScroll);
      }
      stop();
    };
  }, [gradientRef]);
}
