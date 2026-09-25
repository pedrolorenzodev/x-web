import { useState } from "react";
import { IDENTIFIER_PATTERN } from "@/config/auth";
import { FloatingLabelInput } from "@/features/auth/components/floating-label-input";
import { OnboardingStepLayout } from "@/features/auth/components/onboarding-step-layout";
import { PrimaryButton } from "@/features/auth/components/primary-button";

type OnboardingForgotPasswordStepProps = {
  identifier: string;
  error: string | null;
  pending: boolean;
  autoFocus: boolean;
  onBack: () => void;
  onSubmit: (identifier: string) => void;
};

export function OnboardingForgotPasswordStep({
  identifier,
  error,
  pending,
  autoFocus,
  onBack,
  onSubmit,
}: OnboardingForgotPasswordStepProps) {
  const [value, setValue] = useState(identifier);

  function handleSubmit() {
    if (value === "" || pending) return;
    onSubmit(value);
  }

  return (
    <OnboardingStepLayout
      heading="Find your account"
      subheading="Enter your email or username to reset your password."
      onBack={onBack}
      onSubmit={handleSubmit}
      footer={
        <PrimaryButton disabled={value === ""} loading={pending}>
          Continue
        </PrimaryButton>
      }
    >
      <div className="flex flex-col gap-2">
        <FloatingLabelInput
          label="Email or username"
          name="username_or_email"
          value={value}
          onChange={setValue}
          pattern={IDENTIFIER_PATTERN}
          autoFocus={autoFocus}
          error={error ?? undefined}
        />
      </div>
    </OnboardingStepLayout>
  );
}
