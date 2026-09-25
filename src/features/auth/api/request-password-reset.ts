"use server";

import type { PasswordResetResult } from "@/types/auth";
import { findAccountByIdentifier } from "@/mocks/accounts";
import { maskEmail } from "@/features/auth/utils/mask-email";

export async function requestPasswordReset(
  identifier: string,
): Promise<PasswordResetResult> {
  const account = findAccountByIdentifier(identifier);
  if (!account) return { ok: false, error: "not-found" };

  return { ok: true, maskedEmail: maskEmail(account.email) };
}
