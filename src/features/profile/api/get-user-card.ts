"use server";

import type { User } from "@/types/user";
import { findUserByHandle, toUser } from "@/mocks/users";
import { findFollowedByPreview } from "@/mocks/follows";

export async function getUserCard(handle: string): Promise<User | null> {
  const user = findUserByHandle(handle);
  return user ? toUser(user, findFollowedByPreview(user.id)) : null;
}
