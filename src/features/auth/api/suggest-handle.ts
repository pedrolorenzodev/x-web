"use server";

import { checkHandleAvailable } from "@/features/auth/api/check-handle-available";
import { handleCandidates } from "@/features/auth/utils/suggest-handle";

export async function suggestHandle(displayName: string): Promise<string> {
  for (const candidate of handleCandidates(displayName)) {
    const result = await checkHandleAvailable(candidate);
    if (result.ok) return candidate;
  }
  return "";
}
