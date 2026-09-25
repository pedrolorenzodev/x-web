"use server";

import type { LogInInput, LogInResult } from "@/types/auth";
import { findAccountByIdentifier } from "@/mocks/accounts";
import { startMockSession } from "@/mocks/session";

export async function logIn({
  identifier,
  password,
}: LogInInput): Promise<LogInResult> {
  const account = findAccountByIdentifier(identifier);
  if (!account) return { ok: false, error: "not-found" };
  if (account.password !== password) {
    return { ok: false, error: "wrong-password" };
  }

  await startMockSession(account.userId);
  return { ok: true };
}
