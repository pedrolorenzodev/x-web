import { useState } from "react";
import type { SignUpDraft } from "@/features/auth/types/onboarding";
import { PASSWORD_MIN_LENGTH } from "@/config/auth";
import { FloatingLabelInput } from "@/features/auth/components/floating-label-input";
import { OnboardingStepLayout } from "@/features/auth/components/onboarding-step-layout";
import { PasswordVisibilityToggle } from "@/features/auth/components/password-visibility-toggle";
import { PrimaryButton } from "@/features/auth/components/primary-button";

type OnboardingSignUpPasswordStepProps = {
  password: string;
  error: string | null;
  pending: boolean;
  autoFocus: boolean;
  onBack: () => void;
  onChange: (patch: Partial<SignUpDraft>) => void;
  onSubmit: () => void;
};

export function OnboardingSignUpPasswordStep({
  password,
  error,
  pending,
  autoFocus,
  onBack,
  onChange,
  onSubmit,
}: OnboardingSignUpPasswordStepProps) {
  const [visible, setVisible] = useState(false);

  function handleSubmit() {
    if (password !== "" && !pending) onSubmit();
  }

  return (
    <OnboardingStepLayout
      heading="You'll need a password"
      subheading={`Make sure it's ${PASSWORD_MIN_LENGTH} characters or more.`}
      onBack={onBack}
      onSubmit={handleSubmit}
      footer={
        <PrimaryButton disabled={password === ""} loading={pending}>
          Next
        </PrimaryButton>
      }
    >
      <div className="flex flex-col gap-2">
        <FloatingLabelInput
          label="Password"
          name="password"
          type={visible ? "text" : "password"}
          value={password}
          onChange={(value) => onChange({ password: value })}
          autoComplete="new-password"
          autoFocus={autoFocus}
          error={error ?? undefined}
          trailing={
            <PasswordVisibilityToggle
              visible={visible}
              onToggle={() => setVisible((current) => !current)}
            />
          }
        />
      </div>
    </OnboardingStepLayout>
  );
}
