import { useState } from "react";
import type {
  SignUpDetailsErrors,
  SignUpDraft,
} from "@/features/auth/types/onboarding";
import { DISPLAY_NAME_MAX_LENGTH } from "@/config/auth";
import { isCompleteBirthDate } from "@/features/auth/utils/birth-date";
import { emailErrorMessage } from "@/features/auth/utils/sign-up-error-messages";
import { validateEmail } from "@/features/auth/utils/validate-sign-up";
import { BirthDateField } from "@/features/auth/components/birth-date-field";
import { FloatingLabelInput } from "@/features/auth/components/floating-label-input";
import { OnboardingStepLayout } from "@/features/auth/components/onboarding-step-layout";
import { PrimaryButton } from "@/features/auth/components/primary-button";

type OnboardingSignUpDetailsStepProps = {
  draft: SignUpDraft;
  errors: SignUpDetailsErrors;
  pending: boolean;
  autoFocus: boolean;
  onBack: () => void;
  onChange: (patch: Partial<SignUpDraft>) => void;
  onSubmit: () => void;
};

export function OnboardingSignUpDetailsStep({
  draft,
  errors,
  pending,
  autoFocus,
  onBack,
  onChange,
  onSubmit,
}: OnboardingSignUpDetailsStepProps) {
  const [emailBlurred, setEmailBlurred] = useState(false);
  const emailInvalid = validateEmail(draft.email) !== null;
  const canSubmit =
    draft.displayName.trim() !== "" &&
    !emailInvalid &&
    isCompleteBirthDate(draft.birthDate);
  const emailError =
    errors.email ??
    (emailBlurred && draft.email !== "" && emailInvalid
      ? emailErrorMessage.invalid
      : undefined);

  const focusEmail = Boolean(errors.email) && !errors.displayName;

  function handleSubmit() {
    if (canSubmit && !pending) onSubmit();
  }

  return (
    <OnboardingStepLayout
      heading="Create your account"
      onBack={onBack}
      onSubmit={handleSubmit}
      footer={
        <PrimaryButton disabled={!canSubmit} loading={pending}>
          Next
        </PrimaryButton>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <FloatingLabelInput
            label="Name"
            name="name"
            value={draft.displayName}
            onChange={(displayName) => onChange({ displayName })}
            maxLength={DISPLAY_NAME_MAX_LENGTH}
            showCounter
            autoComplete="name"
            autoFocus={autoFocus && !focusEmail}
            error={errors.displayName}
          />
        </div>
        <div className="flex flex-col gap-2">
          <FloatingLabelInput
            label="Email"
            name="email"
            type="email"
            value={draft.email}
            onChange={(email) => onChange({ email })}
            onBlur={() => setEmailBlurred(true)}
            autoComplete="email"
            autoFocus={autoFocus && focusEmail}
            error={emailError}
          />
        </div>
        <BirthDateField
          value={draft.birthDate}
          onChange={(birthDate) => onChange({ birthDate })}
        />
      </div>
    </OnboardingStepLayout>
  );
}
