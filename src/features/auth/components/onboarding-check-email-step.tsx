import { useEffect, useState } from "react";
import { RESET_CODE_LENGTH, RESET_CODE_RETRY_SECONDS } from "@/config/auth";
import { OnboardingStepLayout } from "@/features/auth/components/onboarding-step-layout";
import { PrimaryButton } from "@/features/auth/components/primary-button";
import { VerificationCodeInput } from "@/features/auth/components/verification-code-input";

type OnboardingCheckEmailStepProps = {
  maskedEmail: string;
  error: string | null;
  autoFocus: boolean;
  onBack: () => void;
  onUsePassword: () => void;
  onSubmit: (code: string) => void;
};

function RetryCountdown() {
  const [secondsLeft, setSecondsLeft] = useState(RESET_CODE_RETRY_SECONDS);

  useEffect(() => {
    if (secondsLeft === 0) return;
    const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  return (
    <div className="mt-2 flex gap-1 text-[14px] leading-[21px]">
      <p className="font-normal text-auth-subtle">
        Didn&apos;t receive a code?{secondsLeft > 0 ? " Retry in" : null}
      </p>
      {secondsLeft > 0 ? (
        <>
          <p className="font-bold text-white">{secondsLeft}</p>
          <p className="font-bold text-auth-subtle">seconds</p>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setSecondsLeft(RESET_CODE_RETRY_SECONDS)}
          className="font-bold text-white"
        >
          Resend
        </button>
      )}
    </div>
  );
}

export function OnboardingCheckEmailStep({
  maskedEmail,
  error,
  autoFocus,
  onBack,
  onUsePassword,
  onSubmit,
}: OnboardingCheckEmailStepProps) {
  const [code, setCode] = useState("");
  const complete = code.length === RESET_CODE_LENGTH;

  function handleSubmit() {
    if (complete) onSubmit(code);
  }

  return (
    <OnboardingStepLayout
      heading="Check your email"
      subheading={`The code was sent to ${maskedEmail}`}
      headerAction={
        <button
          type="button"
          onClick={onUsePassword}
          className="text-[15px] leading-5 font-bold text-white"
        >
          Use password
        </button>
      }
      onBack={onBack}
      onSubmit={handleSubmit}
      footer={
        <PrimaryButton disabled={!complete} className="mb-3">
          Continue
        </PrimaryButton>
      }
    >
      <div className="flex flex-col gap-2">
        <VerificationCodeInput
          value={code}
          onChange={setCode}
          autoFocus={autoFocus}
          error={error ?? undefined}
        />
        <RetryCountdown />
      </div>
    </OnboardingStepLayout>
  );
}
