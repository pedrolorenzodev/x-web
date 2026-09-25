import type { Metadata } from "next";
import { ONBOARDING_TITLE } from "@/config/auth";
import { StandaloneOnboarding } from "@/features/auth/components/standalone-onboarding";

export const metadata: Metadata = {
  title: ONBOARDING_TITLE,
};

export default function RegisterPage() {
  return <StandaloneOnboarding mode="signup" />;
}
