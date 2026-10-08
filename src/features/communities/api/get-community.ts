import { connection } from "next/server";
import type { Community } from "@/types/community";
import { getMockViewer } from "@/mocks/session";
import { findCommunity, toCommunity } from "@/mocks/communities";

export async function getCommunity(id: string): Promise<Community | null> {
  await connection();
  const record = findCommunity(id);
  if (!record) return null;

  const viewer = await getMockViewer();
  return toCommunity(record, viewer?.id ?? null);
}
