import { useState } from "react";
import { FloatingLabelInput } from "@/features/auth/components/floating-label-input";
import { LegalNotice } from "@/features/auth/components/legal-notice";
import { OnboardingStepLayout } from "@/features/auth/components/onboarding-step-layout";
import { PasswordVisibilityToggle } from "@/features/auth/components/password-visibility-toggle";
import { PrimaryButton } from "@/features/auth/components/primary-button";

type OnboardingPasswordStepProps = {
  identifier: string;
  error: string | null;
  pending: boolean;
  autoFocus: boolean;
  onBack: () => void;
  onForgotPassword: () => void;
  onSubmit: (password: string) => void;
};

export function OnboardingPasswordStep({
  identifier,
  error,
  pending,
  autoFocus,
  onBack,
  onForgotPassword,
  onSubmit,
}: OnboardingPasswordStepProps) {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  function handleSubmit() {
    if (password === "" || pending) return;
    onSubmit(password);
  }

  return (
    <OnboardingStepLayout
      heading="Login"
      onBack={onBack}
      onSubmit={handleSubmit}
      footer={
        <>
          <PrimaryButton disabled={password === ""} loading={pending}>
            Continue
          </PrimaryButton>
          <LegalNotice className="mx-0" />
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <FloatingLabelInput
          label="Username"
          name="username"
          value={identifier}
          autoComplete="username"
          disabled
        />
        <div className="flex flex-col gap-2">
          <FloatingLabelInput
            label="Password"
            name="password"
            type={visible ? "text" : "password"}
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
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
        <button
          type="button"
          onClick={onForgotPassword}
          className="w-full text-center text-[14px] leading-[21px] font-bold text-white"
        >
          Forgot password?
        </button>
      </div>
    </OnboardingStepLayout>
  );
}
