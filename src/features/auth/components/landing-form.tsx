"use client";

import { useEffect, useState, type FormEvent } from "react";
import type {
  OnboardingIntent,
  OnboardingMode,
} from "@/features/auth/types/onboarding";
import { IDENTIFIER_PATTERN } from "@/config/auth";
import { useOnboardingRequest } from "@/features/auth/hooks/use-onboarding-request";
import { resolveIdentifier } from "@/features/auth/utils/resolve-identifier";
import { FloatingLabelInput } from "@/features/auth/components/floating-label-input";
import { useLandingOnboarding } from "@/features/auth/components/landing-onboarding";
import { LegalNotice } from "@/features/auth/components/legal-notice";
import { OrDivider } from "@/features/auth/components/or-divider";
import { PrimaryButton } from "@/features/auth/components/primary-button";
import { SocialSignInButtons } from "@/features/auth/components/social-sign-in-buttons";

type LandingFormFieldsProps = {
  covered: boolean;
  onOpen: (mode: OnboardingMode, intent: OnboardingIntent) => void;
};

function LandingFormFields({ covered, onOpen }: LandingFormFieldsProps) {
  const [identifier, setIdentifier] = useState("");
  const { busy, run, cancel } = useOnboardingRequest();

  useEffect(() => cancel, [cancel]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (identifier === "") return;
    run(
      () => resolveIdentifier(identifier, "login"),
      (resolution) =>
        onOpen("login", { start: "identifier", identifier, resolution }),
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-96 flex-col gap-5"
    >
      <SocialSignInButtons
        onPhoneClick={() => onOpen("signup", { start: "phone" })}
      />
      <OrDivider />
      <FloatingLabelInput
        label="Email or username"
        name="username_or_email"
        value={identifier}
        onChange={setIdentifier}
        pattern={IDENTIFIER_PATTERN}
        autoComplete="username webauthn"
        autoFocus={!covered}
      />
      <PrimaryButton disabled={identifier === ""} loading={busy}>
        Continue
      </PrimaryButton>
      <LegalNotice
        className={
          covered
            ? "text-auth-muted [&_a]:font-normal [&_a]:text-inherit [&_a]:underline"
            : undefined
        }
      />
    </form>
  );
}

export function LandingForm() {
  const { isOpen, open } = useLandingOnboarding();

  return (
    <LandingFormFields
      key={isOpen ? "covered" : "active"}
      covered={isOpen}
      onOpen={open}
    />
  );
}
