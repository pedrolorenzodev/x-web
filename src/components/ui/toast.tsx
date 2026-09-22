"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const DURATION = 6000;

type Toast = {
  id: number;
  message: string;
  action?: { label: string; href: string };
};

let current: Toast | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function showToast(toast: Omit<Toast, "id">) {
  current = { ...toast, id: Date.now() };
  clearTimeout(timer);
  timer = setTimeout(() => {
    current = null;
    emit();
  }, DURATION);
  emit();
}

export function Toaster() {
  const toast = useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
  if (!toast) return null;

  return (
    <div
      role="status"
      className="fixed bottom-8 left-1/2 z-10 flex h-11 -translate-x-1/2 items-center gap-3 rounded-sm bg-accent p-3 text-base text-white"
    >
      <span>{toast.message}</span>
      {toast.action ? (
        <Link href={toast.action.href} className="font-bold hover:underline">
          {toast.action.label}
        </Link>
      ) : null}
    </div>
  );
}
