"use server";

import { endMockSession } from "@/mocks/session";

export async function logOut() {
  await endMockSession();
}
