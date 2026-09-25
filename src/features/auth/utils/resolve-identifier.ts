import type {
  IdentifierResolution,
  OnboardingMode,
} from "@/features/auth/types/onboarding";
import { checkIdentifier } from "@/features/auth/api/check-identifier";
import { emailErrorMessage } from "@/features/auth/utils/sign-up-error-messages";
import { validateEmail } from "@/features/auth/utils/validate-sign-up";

const unknownIdentifierError: Record<OnboardingMode, string> = {
  login: "We couldn't find an active X account with that username.",
  signup: emailErrorMessage.invalid,
};

export async function resolveIdentifier(
  identifier: string,
  mode: OnboardingMode,
): Promise<IdentifierResolution> {
  if (await checkIdentifier(identifier)) return { next: "password" };
  return validateEmail(identifier) === null
    ? { next: "sign-up" }
    : { next: "error", error: unknownIdentifierError[mode] };
}
