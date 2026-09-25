import type {
  DisplayNameError,
  EmailError,
  HandleError,
  PasswordError,
} from "@/types/auth";
import {
  DISPLAY_NAME_MAX_LENGTH,
  HANDLE_MAX_LENGTH,
  HANDLE_MIN_LENGTH,
  HANDLE_PATTERN,
  PASSWORD_MIN_LENGTH,
  PHONE_MAX_DIGITS,
  PHONE_MIN_DIGITS,
  RESERVED_HANDLES,
} from "@/config/auth";
import { normalizeHandle } from "@/utils/normalize-handle";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): EmailError | null {
  return EMAIL_PATTERN.test(email.trim()) ? null : "invalid";
}

export function validateHandle(handle: string): HandleError | null {
  const value = normalizeHandle(handle);
  if (value.length < HANDLE_MIN_LENGTH) return "too-short";
  if (value.length > HANDLE_MAX_LENGTH) return "too-long";
  if (!HANDLE_PATTERN.test(value)) return "invalid-characters";
  if (RESERVED_HANDLES.includes(value.toLowerCase())) return "taken";
  return null;
}

export function validatePassword(password: string): PasswordError | null {
  return password.length < PASSWORD_MIN_LENGTH ? "too-short" : null;
}

export function validateDisplayName(name: string): DisplayNameError | null {
  const value = name.trim();
  if (!value) return "empty";
  if ([...value].length > DISPLAY_NAME_MAX_LENGTH) return "too-long";
  return null;
}

export function isValidPhoneNumber(phone: string) {
  const digits = phone.replace(/\D/g, "").length;
  return digits >= PHONE_MIN_DIGITS && digits <= PHONE_MAX_DIGITS;
}
