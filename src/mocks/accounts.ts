import { mockUsers } from "@/mocks/users";
import { normalizeHandle } from "@/utils/normalize-handle";

type MockAccount = {
  userId: string;
  email: string;
  password: string;
};

export const mockAccounts: MockAccount[] = mockUsers.map((user) => ({
  userId: user.id,
  email: `${user.handle}@example.com`,
  password: "password",
}));

export function findAccountByEmail(email: string): MockAccount | null {
  const target = email.trim().toLowerCase();
  return (
    mockAccounts.find((account) => account.email.toLowerCase() === target) ??
    null
  );
}

export function findAccountByHandle(handle: string): MockAccount | null {
  const target = normalizeHandle(handle).toLowerCase();
  const user = mockUsers.find((item) => item.handle.toLowerCase() === target);
  if (!user) return null;

  return mockAccounts.find((account) => account.userId === user.id) ?? null;
}

export function findAccountByIdentifier(identifier: string): MockAccount | null {
  return findAccountByEmail(identifier) ?? findAccountByHandle(identifier);
}
