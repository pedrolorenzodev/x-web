"use client";

import { createContext, use, type ReactNode } from "react";
import type { ToggleFollow, User } from "@/types/user";

type UserCardServices = {
  viewerId: string;
  loadUserCard: (handle: string) => Promise<User | null>;
  toggleFollow: ToggleFollow;
};

const UserCardContext = createContext<UserCardServices | null>(null);

export function UserCardProvider({
  children,
  ...services
}: UserCardServices & { children: ReactNode }) {
  return <UserCardContext value={services}>{children}</UserCardContext>;
}

export function useUserCardServices() {
  return use(UserCardContext);
}
