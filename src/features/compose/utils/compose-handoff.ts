import type { ComposerSnapshot } from "@/features/compose/types/composer";

let pending: ComposerSnapshot | null = null;

export function handOffComposer(snapshot: ComposerSnapshot) {
  pending = snapshot;
}

export function readHandedOffComposer() {
  return pending;
}

export function clearHandedOffComposer() {
  pending = null;
}
