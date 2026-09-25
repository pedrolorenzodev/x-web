"use server";

import type { AvailabilityResult, EmailError } from "@/types/auth";
import { findAccountByEmail } from "@/mocks/accounts";
import { validateEmail } from "@/features/auth/utils/validate-sign-up";

export async function checkEmailAvailable(
  email: string,
): Promise<AvailabilityResult<EmailError>> {
  const error =
    validateEmail(email) ?? (findAccountByEmail(email) ? "taken" : null);
  return error ? { ok: false, error } : { ok: true };
}
