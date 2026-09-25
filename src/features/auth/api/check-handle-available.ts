"use server";

import type { AvailabilityResult, HandleError } from "@/types/auth";
import { findAccountByHandle } from "@/mocks/accounts";
import { validateHandle } from "@/features/auth/utils/validate-sign-up";

export async function checkHandleAvailable(
  handle: string,
): Promise<AvailabilityResult<HandleError>> {
  const error =
    validateHandle(handle) ?? (findAccountByHandle(handle) ? "taken" : null);
  return error ? { ok: false, error } : { ok: true };
}
