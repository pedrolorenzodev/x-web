import type { UserSummary } from "@/types/user";

export type Session = {
  user: UserSummary;
};

export type LogInInput = {
  identifier: string;
  password: string;
};

export type SignUpInput = {
  email: string;
  password: string;
  handle: string;
  displayName: string;
};

export type LogInError = "not-found" | "wrong-password";

export type LogInResult = { ok: true } | { ok: false; error: LogInError };

export type EmailError = "invalid" | "taken";

export type HandleError = "too-short" | "too-long" | "invalid-characters" | "taken";

export type PasswordError = "too-short";

export type DisplayNameError = "empty" | "too-long";

export type SignUpErrors = {
  email?: EmailError;
  handle?: HandleError;
  password?: PasswordError;
  displayName?: DisplayNameError;
};

export type SignUpResult = { ok: true } | { ok: false; errors: SignUpErrors };

export type AvailabilityResult<E> = { ok: true } | { ok: false; error: E };

export type PasswordResetResult =
  | { ok: true; maskedEmail: string }
  | { ok: false; error: "not-found" };
