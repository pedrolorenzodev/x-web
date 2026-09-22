import { connection } from "next/server";
import type { User } from "@/types/user";
import { findUserByHandle } from "@/mocks/users";

export async function getProfile(handle: string): Promise<User | null> {
  await connection();

  return findUserByHandle(handle);
}
