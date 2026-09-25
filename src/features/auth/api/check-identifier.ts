"use server";

import { findAccountByIdentifier } from "@/mocks/accounts";

export async function checkIdentifier(identifier: string): Promise<boolean> {
  return findAccountByIdentifier(identifier) !== null;
}
