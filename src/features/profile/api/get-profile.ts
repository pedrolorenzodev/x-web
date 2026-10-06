import { connection } from "next/server";
import type { User } from "@/types/user";
import { findUserByHandle, toUser } from "@/mocks/users";
import { getFollowersYouKnowPreview } from "@/features/profile/api/get-follow-lists";

export async function getProfile(handle: string): Promise<User | null> {
  await connection();

  const user = findUserByHandle(handle);
  return user ? toUser(user, await getFollowersYouKnowPreview(user.handle)) : null;
}
