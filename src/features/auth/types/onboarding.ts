export type OnboardingMode = "login" | "signup";

export type IdentifierResolution =
  | { next: "password" }
  | { next: "sign-up" }
  | { next: "error"; error: string };

export type OnboardingIntent =
  | { start: "default" }
  | { start: "phone" }
  | { start: "identifier"; identifier: string; resolution: IdentifierResolution };

export type BirthDate = {
  month: string;
  day: string;
  year: string;
};

export type SignUpDraft = {
  countryCode: string;
  phone: string;
  displayName: string;
  email: string;
  birthDate: BirthDate;
  password: string;
  handle: string;
};

export type SignUpDetailsErrors = {
  displayName?: string;
  email?: string;
};

export type OnboardingStep =
  | { name: "start"; identifier: string; error: string | null }
  | { name: "password"; identifier: string; error: string | null }
  | { name: "forgot-password"; identifier: string; error: string | null }
  | {
      name: "check-email";
      identifier: string;
      maskedEmail: string;
      error: string | null;
    }
  | { name: "phone"; validate: boolean }
  | { name: "sign-up-details"; errors: SignUpDetailsErrors }
  | { name: "sign-up-password"; error: string | null }
  | { name: "sign-up-handle"; error: string | null };

export type OnboardingFlow = {
  steps: OnboardingStep[];
  direction: "forward" | "back";
  revision: number;
  signUp: SignUpDraft;
};
