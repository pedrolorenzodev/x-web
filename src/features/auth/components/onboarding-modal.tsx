import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type {
  OnboardingFlow,
  OnboardingIntent,
  OnboardingMode,
  OnboardingStep,
  SignUpDraft,
} from "@/features/auth/types/onboarding";
import { routes } from "@/config/routes";
import { checkEmailAvailable } from "@/features/auth/api/check-email-available";
import { logIn } from "@/features/auth/api/log-in";
import { requestPasswordReset } from "@/features/auth/api/request-password-reset";
import { signUp } from "@/features/auth/api/sign-up";
import { suggestHandle } from "@/features/auth/api/suggest-handle";
import { useOnboardingRequest } from "@/features/auth/hooks/use-onboarding-request";
import {
  PHONE_STEP,
  clearEditedErrors,
  initialFlow,
  isSignUpStep,
  routeToErrorStep,
  signUpFromStart,
  stepForSignUpErrors,
  stepsFromStart,
} from "@/features/auth/utils/onboarding-flow";
import { resolveIdentifier } from "@/features/auth/utils/resolve-identifier";
import {
  displayNameErrorMessage,
  emailErrorMessage,
  passwordErrorMessage,
} from "@/features/auth/utils/sign-up-error-messages";
import {
  isValidPhoneNumber,
  validateDisplayName,
  validatePassword,
} from "@/features/auth/utils/validate-sign-up";
import { OnboardingCheckEmailStep } from "@/features/auth/components/onboarding-check-email-step";
import { OnboardingDialog } from "@/features/auth/components/onboarding-dialog";
import { OnboardingForgotPasswordStep } from "@/features/auth/components/onboarding-forgot-password-step";
import { OnboardingPasswordStep } from "@/features/auth/components/onboarding-password-step";
import { OnboardingPhoneStep } from "@/features/auth/components/onboarding-phone-step";
import { OnboardingSignUpDetailsStep } from "@/features/auth/components/onboarding-sign-up-details-step";
import { OnboardingSignUpHandleStep } from "@/features/auth/components/onboarding-sign-up-handle-step";
import { OnboardingSignUpPasswordStep } from "@/features/auth/components/onboarding-sign-up-password-step";
import { OnboardingStartStep } from "@/features/auth/components/onboarding-start-step";

type OnboardingModalProps = {
  mode: OnboardingMode;
  intent?: OnboardingIntent;
  onClose: () => void;
};

const dialogLabel: Record<OnboardingMode, string> = {
  login: "Log in to X",
  signup: "Sign up for X",
};

const WRONG_PASSWORD_ERROR = "Wrong password!";
const ACCOUNT_NOT_FOUND_ERROR = "Sorry, we could not find your account.";
const INVALID_CODE_ERROR = "Invalid code";

export function OnboardingModal({
  mode,
  intent = { start: "default" },
  onClose,
}: OnboardingModalProps) {
  const router = useRouter();
  const [flow, setFlow] = useState<OnboardingFlow>(() => initialFlow(intent));
  const request = useOnboardingRequest();
  const contentRef = useRef<HTMLDivElement>(null);

  const step = flow.steps[flow.steps.length - 1];
  const draft = flow.signUp;
  const autoFocus = flow.direction === "forward";
  const pending = request.busy;

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    if (flow.direction === "forward" && content.contains(document.activeElement)) {
      return;
    }
    content
      .querySelector<HTMLElement>("[data-onboarding-back]")
      ?.focus({ preventScroll: true });
  }, [flow.direction, flow.steps.length, flow.revision]);

  function push(next: OnboardingStep) {
    setFlow((current) =>
      current.steps[current.steps.length - 1].name === next.name
        ? current
        : { ...current, steps: [...current.steps, next], direction: "forward" },
    );
  }

  function replaceCurrent(next: OnboardingStep) {
    setFlow((current) => ({
      ...current,
      steps: [...current.steps.slice(0, -1), next],
    }));
  }

  function back() {
    request.cancel();
    if (flow.steps.length === 1) {
      onClose();
      return;
    }
    setFlow((current) => ({
      ...current,
      steps: current.steps.slice(0, -1),
      direction: "back",
    }));
  }

  function updateSignUp(patch: Partial<SignUpDraft>) {
    setFlow((current) => ({
      ...current,
      steps: [
        ...current.steps.slice(0, -1),
        clearEditedErrors(current.steps[current.steps.length - 1], patch),
      ],
      signUp: { ...current.signUp, ...patch },
    }));
  }

  function submitIdentifier(identifier: string) {
    request.run(
      () => resolveIdentifier(identifier, mode),
      (resolution) =>
        setFlow((current) => ({
          ...current,
          steps: [
            ...current.steps.slice(0, -1),
            ...stepsFromStart(identifier, resolution),
          ],
          direction: "forward",
          signUp: signUpFromStart(current.signUp, identifier, resolution),
        })),
    );
  }

  function submitPassword(identifier: string, password: string) {
    request.run(
      () => logIn({ identifier, password }),
      (result) => {
        if (result.ok) {
          router.replace(routes.home);
          return "navigating";
        }
        replaceCurrent({
          name: "password",
          identifier,
          error:
            result.error === "wrong-password"
              ? WRONG_PASSWORD_ERROR
              : ACCOUNT_NOT_FOUND_ERROR,
        });
      },
    );
  }

  function submitPasswordReset(identifier: string) {
    request.run(
      () => requestPasswordReset(identifier),
      (result) =>
        result.ok
          ? push({
              name: "check-email",
              identifier,
              maskedEmail: result.maskedEmail,
              error: null,
            })
          : replaceCurrent({
              name: "forgot-password",
              identifier,
              error: ACCOUNT_NOT_FOUND_ERROR,
            }),
    );
  }

  function returnToPassword(identifier: string) {
    setFlow((current) => {
      const passwordIndex = current.steps.findIndex(
        (item) => item.name === "password",
      );
      const before =
        passwordIndex === -1 ? current.steps : current.steps.slice(0, passwordIndex);
      return {
        ...current,
        steps: [...before, { name: "password", identifier, error: null }],
        direction: "forward",
      };
    });
  }

  function submitPhone() {
    if (isValidPhoneNumber(draft.phone)) {
      push({ name: "sign-up-details", errors: {} });
      return;
    }
    replaceCurrent({ name: "phone", validate: true });
  }

  function submitDetails() {
    const displayNameError = validateDisplayName(draft.displayName);
    if (displayNameError) {
      replaceCurrent({
        name: "sign-up-details",
        errors: { displayName: displayNameErrorMessage[displayNameError] },
      });
      return;
    }
    request.run(
      () => checkEmailAvailable(draft.email),
      (result) =>
        result.ok
          ? push({ name: "sign-up-password", error: null })
          : replaceCurrent({
              name: "sign-up-details",
              errors: { email: emailErrorMessage[result.error] },
            }),
    );
  }

  function submitSignUpPassword() {
    const passwordError = validatePassword(draft.password);
    if (passwordError) {
      replaceCurrent({
        name: "sign-up-password",
        error: passwordErrorMessage[passwordError],
      });
      return;
    }
    if (draft.handle !== "") {
      push({ name: "sign-up-handle", error: null });
      return;
    }
    request.run(
      () => suggestHandle(draft.displayName),
      (handle) => {
        setFlow((current) => ({
          ...current,
          signUp: { ...current.signUp, handle },
        }));
        push({ name: "sign-up-handle", error: null });
      },
    );
  }

  function submitSignUp() {
    const { email, password, handle, displayName } = draft;
    request.run(
      () => signUp({ email, password, handle, displayName }),
      (result) => {
        if (result.ok) {
          router.replace(routes.home);
          return "navigating";
        }
        const errorStep = stepForSignUpErrors(result.errors);
        setFlow((current) => routeToErrorStep(current, errorStep));
      },
    );
  }

  function renderStep() {
    switch (step.name) {
      case "start":
        return (
          <OnboardingStartStep
            identifier={step.identifier}
            error={step.error}
            pending={pending}
            autoFocus={autoFocus}
            onBack={back}
            onPhone={() => push(PHONE_STEP)}
            onSubmit={submitIdentifier}
          />
        );
      case "password":
        return (
          <OnboardingPasswordStep
            identifier={step.identifier}
            error={step.error}
            pending={pending}
            autoFocus={autoFocus}
            onBack={back}
            onForgotPassword={() =>
              push({
                name: "forgot-password",
                identifier: step.identifier,
                error: null,
              })
            }
            onSubmit={(password) => submitPassword(step.identifier, password)}
          />
        );
      case "forgot-password":
        return (
          <OnboardingForgotPasswordStep
            identifier={step.identifier}
            error={step.error}
            pending={pending}
            autoFocus={autoFocus}
            onBack={back}
            onSubmit={submitPasswordReset}
          />
        );
      case "check-email":
        return (
          <OnboardingCheckEmailStep
            maskedEmail={step.maskedEmail}
            error={step.error}
            autoFocus={autoFocus}
            onBack={back}
            onUsePassword={() => returnToPassword(step.identifier)}
            onSubmit={() => replaceCurrent({ ...step, error: INVALID_CODE_ERROR })}
          />
        );
      case "phone":
        return (
          <OnboardingPhoneStep
            countryCode={draft.countryCode}
            phone={draft.phone}
            validate={step.validate}
            autoFocus={autoFocus}
            onBack={back}
            onChange={updateSignUp}
            onSubmit={submitPhone}
          />
        );
      case "sign-up-details":
        return (
          <OnboardingSignUpDetailsStep
            draft={draft}
            errors={step.errors}
            pending={pending}
            autoFocus={autoFocus}
            onBack={back}
            onChange={updateSignUp}
            onSubmit={submitDetails}
          />
        );
      case "sign-up-password":
        return (
          <OnboardingSignUpPasswordStep
            password={draft.password}
            error={step.error}
            pending={pending}
            autoFocus={autoFocus}
            onBack={back}
            onChange={updateSignUp}
            onSubmit={submitSignUpPassword}
          />
        );
      case "sign-up-handle":
        return (
          <OnboardingSignUpHandleStep
            handle={draft.handle}
            error={step.error}
            pending={pending}
            autoFocus={autoFocus}
            onBack={back}
            onChange={updateSignUp}
            onSubmit={submitSignUp}
          />
        );
    }
  }

  return (
    <OnboardingDialog
      label={isSignUpStep(step) ? dialogLabel.signup : dialogLabel[mode]}
      onDismiss={onClose}
    >
      <div
        ref={contentRef}
        key={`${flow.steps.length}-${step.name}-${flow.revision}`}
        className="h-full"
      >
        {renderStep()}
      </div>
    </OnboardingDialog>
  );
}
