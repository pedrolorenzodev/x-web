"use server";

import type { SignUpErrors, SignUpInput, SignUpResult } from "@/types/auth";
import { mockUsers } from "@/mocks/users";
import { mockAccounts } from "@/mocks/accounts";
import { startMockSession } from "@/mocks/session";
import { DEFAULT_AVATAR_URL } from "@/config/auth";
import { normalizeHandle } from "@/utils/normalize-handle";
import { checkEmailAvailable } from "@/features/auth/api/check-email-available";
import { checkHandleAvailable } from "@/features/auth/api/check-handle-available";
import {
  validateDisplayName,
  validatePassword,
} from "@/features/auth/utils/validate-sign-up";

export async function signUp(input: SignUpInput): Promise<SignUpResult> {
  const [email, handle] = await Promise.all([
    checkEmailAvailable(input.email),
    checkHandleAvailable(input.handle),
  ]);
  const password = validatePassword(input.password);
  const displayName = validateDisplayName(input.displayName);

  const errors: SignUpErrors = {};
  if (!email.ok) errors.email = email.error;
  if (!handle.ok) errors.handle = handle.error;
  if (password) errors.password = password;
  if (displayName) errors.displayName = displayName;
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const id = `u${Date.now()}`;
  mockUsers.push({
    id,
    handle: normalizeHandle(input.handle),
    displayName: input.displayName.trim(),
    avatarUrl: DEFAULT_AVATAR_URL,
    bio: "",
    bannerUrl: null,
    joinedAt: new Date().toISOString(),
    followingCount: 0,
    followersCount: 0,
    postsCount: 0,
    followedByViewer: false,
  });
  mockAccounts.push({
    userId: id,
    email: input.email.trim(),
    password: input.password,
  });

  await startMockSession(id);
  return { ok: true };
}
