"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const LIFETIME = 4000;
const FADE = 170;

type ToastAction =
  | { label: string; href: string }
  | { label: string; onClick: () => void };

type Toast = {
  id: number;
  message: string;
  action?: ToastAction;
  leaving: boolean;
};

let current: Toast | null = null;
let lifetimeTimer: ReturnType<typeof setTimeout> | undefined;
let fadeTimer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function dismissToast() {
  if (!current) return;
  current = { ...current, leaving: true };
  emit();
  clearTimeout(fadeTimer);
  fadeTimer = setTimeout(() => {
    current = null;
    emit();
  }, FADE);
}

export function showToast(toast: { message: string; action?: ToastAction }) {
  clearTimeout(lifetimeTimer);
  clearTimeout(fadeTimer);
  current = { ...toast, id: Date.now(), leaving: false };
  lifetimeTimer = setTimeout(dismissToast, LIFETIME);
  emit();
}

export function Toaster() {
  const toast = useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );

  return (
    <div className="pointer-events-none fixed bottom-8 z-60 flex w-feed max-w-full justify-center max-[499px]:bottom-[73px]">
      {toast ? (
        <div
          key={toast.id}
          role="status"
          className={cn(
            "t-toast pointer-events-auto flex min-h-11 max-w-[calc(100%-32px)] items-center rounded-sm bg-accent p-3 text-base text-white",
            toast.leaving && "is-leaving",
          )}
        >
          <span>{toast.message}</span>
          {toast.action ? <ToastActionButton action={toast.action} /> : null}
        </div>
      ) : null}
    </div>
  );
}

function ToastActionButton({ action }: { action: ToastAction }) {
  const className = "mx-3 font-bold whitespace-nowrap hover:underline";

  if ("href" in action) {
    return (
      <Link href={action.href} onClick={dismissToast} className={className}>
        {action.label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        action.onClick();
        dismissToast();
      }}
      className={className}
    >
      {action.label}
    </button>
  );
}
