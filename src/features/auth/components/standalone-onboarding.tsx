"use client";

import { useRouter } from "next/navigation";
import type { OnboardingMode } from "@/features/auth/types/onboarding";
import { routes } from "@/config/routes";
import { OnboardingModal } from "@/features/auth/components/onboarding-modal";

type StandaloneOnboardingProps = {
  mode: OnboardingMode;
};

export function StandaloneOnboarding({ mode }: StandaloneOnboardingProps) {
  const router = useRouter();

  return <OnboardingModal mode={mode} onClose={() => router.replace(routes.home)} />;
}
