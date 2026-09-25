"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  OnboardingIntent,
  OnboardingMode,
} from "@/features/auth/types/onboarding";
import { routes } from "@/config/routes";
import { ONBOARDING_TITLE } from "@/config/auth";
import { OnboardingModal } from "@/features/auth/components/onboarding-modal";

type LandingOnboardingValue = {
  isOpen: boolean;
  open: (mode: OnboardingMode, intent: OnboardingIntent) => void;
};

const LandingOnboardingContext = createContext<LandingOnboardingValue | null>(
  null,
);

const HISTORY_KEY = "xWebOnboarding";

type OnboardingHistoryEntry = {
  id: string;
  intent: OnboardingIntent;
};

let entryCount = 0;

function readHistoryEntry(): OnboardingHistoryEntry | null {
  return window.history.state?.[HISTORY_KEY] ?? null;
}

const pathByMode: Record<OnboardingMode, string> = {
  login: routes.login,
  signup: routes.register,
};

function modeFromPath(pathname: string): OnboardingMode | null {
  if (pathname === routes.login) return "login";
  if (pathname === routes.register) return "signup";
  return null;
}

function closeOnboarding() {
  if (readHistoryEntry()) {
    window.history.back();
  } else {
    window.history.replaceState(null, "", routes.home);
  }
}

export function useLandingOnboarding() {
  const value = use(LandingOnboardingContext);
  if (!value) {
    throw new Error("useLandingOnboarding needs a LandingOnboardingProvider");
  }
  return value;
}

function LandingOnboardingModal({ mode }: { mode: OnboardingMode }) {
  const [intent] = useState<OnboardingIntent>(
    () => readHistoryEntry()?.intent ?? { start: "default" },
  );

  return (
    <OnboardingModal mode={mode} intent={intent} onClose={closeOnboarding} />
  );
}

export function LandingOnboardingProvider({ children }: { children: ReactNode }) {
  const mode = modeFromPath(usePathname());
  const isOpen = mode !== null;

  const open = useCallback((nextMode: OnboardingMode, intent: OnboardingIntent) => {
    if (modeFromPath(window.location.pathname)) return;
    entryCount += 1;
    const entry: OnboardingHistoryEntry = {
      id: `${Date.now().toString(36)}-${entryCount}`,
      intent,
    };
    window.history.pushState({ [HISTORY_KEY]: entry }, "", pathByMode[nextMode]);
  }, []);

  const value = useMemo(() => ({ isOpen, open }), [isOpen, open]);

  useEffect(() => {
    if (!isOpen) return;
    const previousTitle = document.title;
    document.title = ONBOARDING_TITLE;
    return () => {
      if (document.title === ONBOARDING_TITLE) document.title = previousTitle;
    };
  }, [isOpen]);

  return (
    <LandingOnboardingContext value={value}>
      <div inert={isOpen} className="contents">
        {children}
      </div>
      {mode ? (
        <LandingOnboardingModal
          key={`${mode}-${readHistoryEntry()?.id ?? "entry"}`}
          mode={mode}
        />
      ) : null}
    </LandingOnboardingContext>
  );
}
