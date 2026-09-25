import type { SignUpErrors } from "@/types/auth";
import type {
  IdentifierResolution,
  OnboardingFlow,
  OnboardingIntent,
  OnboardingStep,
  SignUpDraft,
} from "@/features/auth/types/onboarding";
import { DEFAULT_PHONE_COUNTRY } from "@/config/phone-countries";
import {
  displayNameErrorMessage,
  emailErrorMessage,
  handleErrorMessage,
  passwordErrorMessage,
} from "@/features/auth/utils/sign-up-error-messages";

const EMPTY_SIGN_UP: SignUpDraft = {
  countryCode: DEFAULT_PHONE_COUNTRY,
  phone: "",
  displayName: "",
  email: "",
  birthDate: { month: "", day: "", year: "" },
  password: "",
  handle: "",
};

const SIGN_UP_STEPS: OnboardingStep["name"][] = [
  "phone",
  "sign-up-details",
  "sign-up-password",
  "sign-up-handle",
];

export const PHONE_STEP: OnboardingStep = { name: "phone", validate: false };

export function isSignUpStep(step: OnboardingStep) {
  return SIGN_UP_STEPS.includes(step.name);
}

export function stepsFromStart(
  identifier: string,
  resolution: IdentifierResolution,
): OnboardingStep[] {
  const error = resolution.next === "error" ? resolution.error : null;
  const start: OnboardingStep = { name: "start", identifier, error };
  if (resolution.next === "password") {
    return [start, { name: "password", identifier, error: null }];
  }
  if (resolution.next === "sign-up") {
    return [start, { name: "sign-up-details", errors: {} }];
  }
  return [start];
}

export function signUpFromStart(
  draft: SignUpDraft,
  identifier: string,
  resolution: IdentifierResolution,
): SignUpDraft {
  return resolution.next === "sign-up" ? { ...draft, email: identifier } : draft;
}

function initialSteps(intent: OnboardingIntent): OnboardingStep[] {
  if (intent.start === "phone") return [PHONE_STEP];
  if (intent.start === "identifier") {
    return stepsFromStart(intent.identifier, intent.resolution);
  }
  return [{ name: "start", identifier: "", error: null }];
}

export function initialFlow(intent: OnboardingIntent): OnboardingFlow {
  return {
    steps: initialSteps(intent),
    direction: "forward",
    revision: 0,
    signUp:
      intent.start === "identifier"
        ? signUpFromStart(EMPTY_SIGN_UP, intent.identifier, intent.resolution)
        : EMPTY_SIGN_UP,
  };
}

export function clearEditedErrors(
  step: OnboardingStep,
  patch: Partial<SignUpDraft>,
): OnboardingStep {
  switch (step.name) {
    case "sign-up-details":
      return {
        ...step,
        errors: {
          displayName: "displayName" in patch ? undefined : step.errors.displayName,
          email: "email" in patch ? undefined : step.errors.email,
        },
      };
    case "sign-up-password":
      return "password" in patch ? { ...step, error: null } : step;
    case "sign-up-handle":
      return "handle" in patch ? { ...step, error: null } : step;
    default:
      return step;
  }
}

export function stepForSignUpErrors(errors: SignUpErrors): OnboardingStep {
  if (errors.email || errors.displayName) {
    return {
      name: "sign-up-details",
      errors: {
        displayName: errors.displayName
          ? displayNameErrorMessage[errors.displayName]
          : undefined,
        email: errors.email ? emailErrorMessage[errors.email] : undefined,
      },
    };
  }
  if (errors.password) {
    return {
      name: "sign-up-password",
      error: passwordErrorMessage[errors.password],
    };
  }
  return {
    name: "sign-up-handle",
    error: errors.handle ? handleErrorMessage[errors.handle] : null,
  };
}

export function routeToErrorStep(
  flow: OnboardingFlow,
  errorStep: OnboardingStep,
): OnboardingFlow {
  const index = flow.steps.findIndex((item) => item.name === errorStep.name);
  const target = index === -1 ? flow.steps.length - 1 : index;
  return {
    ...flow,
    steps: [...flow.steps.slice(0, target), errorStep],
    direction: "forward",
    revision: flow.revision + 1,
  };
}
