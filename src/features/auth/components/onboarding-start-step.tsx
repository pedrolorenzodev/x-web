import { useState } from "react";
import { IDENTIFIER_PATTERN } from "@/config/auth";
import { FloatingLabelInput } from "@/features/auth/components/floating-label-input";
import { LegalNotice } from "@/features/auth/components/legal-notice";
import { OnboardingStepLayout } from "@/features/auth/components/onboarding-step-layout";
import { OrDivider } from "@/features/auth/components/or-divider";
import { PrimaryButton } from "@/features/auth/components/primary-button";
import { SocialSignInButtons } from "@/features/auth/components/social-sign-in-buttons";

type OnboardingStartStepProps = {
  identifier: string;
  error: string | null;
  pending: boolean;
  autoFocus: boolean;
  onBack: () => void;
  onPhone: () => void;
  onSubmit: (identifier: string) => void;
};

export function OnboardingStartStep({
  identifier,
  error,
  pending,
  autoFocus,
  onBack,
  onPhone,
  onSubmit,
}: OnboardingStartStepProps) {
  const [value, setValue] = useState(identifier);

  function handleSubmit() {
    if (value === "" || pending) return;
    onSubmit(value);
  }

  return (
    <OnboardingStepLayout
      heading="See what's happening"
      subheading="Select an option below:"
      column="narrow"
      inlineLogoWhenCompact
      onBack={onBack}
      onSubmit={handleSubmit}
      footer={
        <>
          <PrimaryButton disabled={value === ""} loading={pending}>
            Continue
          </PrimaryButton>
          <LegalNotice className="max-narrow:mx-0" />
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <SocialSignInButtons onPhoneClick={onPhone} googleClassName="h-12" />
        <OrDivider />
        <FloatingLabelInput
          label="Email or username"
          name="username_or_email"
          value={value}
          onChange={setValue}
          pattern={IDENTIFIER_PATTERN}
          autoComplete="username webauthn"
          autoFocus={autoFocus}
          error={error ?? undefined}
        />
      </div>
    </OnboardingStepLayout>
  );
}
