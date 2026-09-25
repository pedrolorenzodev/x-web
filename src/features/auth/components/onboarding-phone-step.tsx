import { PHONE_COUNTRIES, type PhoneCountry } from "@/config/phone-countries";
import type { SignUpDraft } from "@/features/auth/types/onboarding";
import {
  EMPTY_FIELD_ERROR,
  INVALID_PHONE_ERROR,
} from "@/features/auth/utils/sign-up-error-messages";
import { isValidPhoneNumber } from "@/features/auth/utils/validate-sign-up";
import { OnboardingStepLayout } from "@/features/auth/components/onboarding-step-layout";
import { PhoneNumberField } from "@/features/auth/components/phone-number-field";
import { PrimaryButton } from "@/features/auth/components/primary-button";
import { PrivacyOptions } from "@/features/auth/components/privacy-options";

type OnboardingPhoneStepProps = {
  countryCode: string;
  phone: string;
  validate: boolean;
  autoFocus: boolean;
  onBack: () => void;
  onChange: (patch: Partial<SignUpDraft>) => void;
  onSubmit: () => void;
};

function phoneError(phone: string) {
  if (phone === "") return EMPTY_FIELD_ERROR;
  return isValidPhoneNumber(phone) ? null : INVALID_PHONE_ERROR;
}

function findCountry(code: string): PhoneCountry {
  return PHONE_COUNTRIES.find((item) => item.code === code) ?? PHONE_COUNTRIES[0];
}

export function OnboardingPhoneStep({
  countryCode,
  phone,
  validate,
  autoFocus,
  onBack,
  onChange,
  onSubmit,
}: OnboardingPhoneStepProps) {
  const error = validate ? phoneError(phone) : null;
  const canSubmit = phone !== "" && error === null;

  function handleSubmit() {
    if (canSubmit) onSubmit();
  }

  return (
    <OnboardingStepLayout
      heading="Enter your phone number"
      onBack={onBack}
      onSubmit={handleSubmit}
      footer={
        <>
          <div className="mb-4 flex flex-col gap-1 px-3">
            <p className="text-[12px] leading-[16.5px] font-normal text-auth-subtle">
              We&apos;ll send an SMS verification code. By entering your number, you
              agree to receive transactional messaging about your account. Others
              will be able to find you by phone number.
            </p>
            <PrivacyOptions />
          </div>
          <PrimaryButton disabled={!canSubmit}>Continue</PrimaryButton>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <PhoneNumberField
          country={findCountry(countryCode)}
          phone={phone}
          error={error ?? undefined}
          autoFocus={autoFocus}
          onCountryChange={(country) => onChange({ countryCode: country.code })}
          onPhoneChange={(value) => onChange({ phone: value })}
        />
      </div>
    </OnboardingStepLayout>
  );
}
