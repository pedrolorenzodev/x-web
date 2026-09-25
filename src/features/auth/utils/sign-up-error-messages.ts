import type {
  DisplayNameError,
  EmailError,
  HandleError,
  PasswordError,
} from "@/types/auth";
import { DISPLAY_NAME_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/config/auth";

export const emailErrorMessage: Record<EmailError, string> = {
  invalid: "Please enter a valid email address.",
  taken: "Email has already been taken.",
};

export const displayNameErrorMessage: Record<DisplayNameError, string> = {
  empty: "What's your name?",
  "too-long": `Your name must be ${DISPLAY_NAME_MAX_LENGTH} characters or less.`,
};

export const passwordErrorMessage: Record<PasswordError, string> = {
  "too-short": `Your password needs to be at least ${PASSWORD_MIN_LENGTH} characters. Please enter a longer one.`,
};

export const handleErrorMessage: Record<HandleError, string> = {
  taken: "That username has been taken. Please choose another.",
  "too-short": "Your username must be longer than 4 characters.",
  "too-long": "Your username must be shorter than 15 characters.",
  "invalid-characters": "Your username can only contain letters, numbers and '_'.",
};

export const INVALID_PHONE_ERROR = "Please enter a valid value";
export const EMPTY_FIELD_ERROR = "Please fill out this field.";
