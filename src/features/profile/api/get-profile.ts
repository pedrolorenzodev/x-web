import { connection } from "next/server";
import type { User } from "@/types/user";
import { findUserByHandle, toUser } from "@/mocks/users";
import { findFollowedByPreview } from "@/mocks/follows";

export async function getProfile(handle: string): Promise<User | null> {
  await connection();

  const user = findUserByHandle(handle);
  return user ? toUser(user, findFollowedByPreview(user.id)) : null;
}
