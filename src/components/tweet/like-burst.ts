import type { CSSProperties } from "react";

export type LikeBurst = {
  id: number;
  particles: CSSProperties[];
  duration: number;
};

const PARTICLE_COUNT = 8;
const ANGLE_JITTER = Math.PI / 14;
const MAX_DELAY_MS = 40;

function between(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function readProperty(property: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
}

function readPixels(property: string) {
  return parseFloat(readProperty(property)) || 0;
}

function readMilliseconds(property: string) {
  const value = readProperty(property);
  const amount = parseFloat(value) || 0;
  return value.endsWith("ms") ? amount : amount * 1000;
}

export function createLikeBurst(id: number): LikeBurst {
  const distance = readPixels("--like-particle-dist");
  const baseDuration = readMilliseconds("--like-particle-dur");
  let duration = 0;

  const particles = Array.from({ length: PARTICLE_COUNT }, (_, index) => {
    const angle =
      (index / PARTICLE_COUNT) * Math.PI * 2 + between(-ANGLE_JITTER, ANGLE_JITTER);
    const reach = distance * between(0.8, 1.25);
    const particleDuration = baseDuration * between(0.8, 1.1);
    const delay = between(0, MAX_DELAY_MS);
    duration = Math.max(duration, particleDuration + delay);
    return {
      "--px": `${Math.cos(angle) * reach}px`,
      "--py": `${Math.sin(angle) * reach}px`,
      "--pdur": `${particleDuration}ms`,
      "--pdelay": `${delay}ms`,
      "--psize": between(0.8, 1.3),
      "--p-end-scale": between(0.4, 0.8),
    } as CSSProperties;
  });

  return { id, particles, duration };
}
