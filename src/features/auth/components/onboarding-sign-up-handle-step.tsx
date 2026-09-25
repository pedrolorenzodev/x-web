import type { SignUpDraft } from "@/features/auth/types/onboarding";
import { CheckCircleFillIcon } from "@/components/ui/icons";
import { useHandleAvailability } from "@/features/auth/hooks/use-handle-availability";
import { handleErrorMessage } from "@/features/auth/utils/sign-up-error-messages";
import { FloatingLabelInput } from "@/features/auth/components/floating-label-input";
import { OnboardingStepLayout } from "@/features/auth/components/onboarding-step-layout";
import { PrimaryButton } from "@/features/auth/components/primary-button";

type OnboardingSignUpHandleStepProps = {
  handle: string;
  error: string | null;
  pending: boolean;
  autoFocus: boolean;
  onBack: () => void;
  onChange: (patch: Partial<SignUpDraft>) => void;
  onSubmit: () => void;
};

export function OnboardingSignUpHandleStep({
  handle,
  error,
  pending,
  autoFocus,
  onBack,
  onChange,
  onSubmit,
}: OnboardingSignUpHandleStepProps) {
  const availability = useHandleAvailability(handle);
  const available = availability?.ok === true && error === null;
  const shownError =
    error ??
    (availability && !availability.ok
      ? handleErrorMessage[availability.error]
      : undefined);

  function handleSubmit() {
    if (available && !pending) onSubmit();
  }

  return (
    <OnboardingStepLayout
      heading="What should we call you?"
      subheading="Your @username is unique. You can always change it later."
      onBack={onBack}
      onSubmit={handleSubmit}
      footer={
        <PrimaryButton disabled={!available} loading={pending}>
          Sign up
        </PrimaryButton>
      }
    >
      <div className="flex flex-col gap-2">
        <FloatingLabelInput
          label="Username"
          name="username"
          value={handle}
          onChange={(value) => onChange({ handle: value })}
          prefix="@"
          autoComplete="username"
          autoFocus={autoFocus}
          error={shownError}
          trailing={
            available ? (
              <CheckCircleFillIcon className="size-5 text-repost" />
            ) : null
          }
        />
        <p role="status" className="sr-only">
          {available ? "Username available" : ""}
        </p>
      </div>
    </OnboardingStepLayout>
  );
}
