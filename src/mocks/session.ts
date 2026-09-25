import { cookies } from "next/headers";
import type { User } from "@/types/user";
import { SESSION_COOKIE } from "@/config/auth";
import { findUserById } from "@/mocks/users";

const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export async function getMockViewer(): Promise<User | null> {
  const userId = (await cookies()).get(SESSION_COOKIE)?.value;
  return userId ? findUserById(userId) : null;
}

export async function startMockSession(userId: string) {
  (await cookies()).set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endMockSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
