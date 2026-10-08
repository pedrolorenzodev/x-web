import { connection } from "next/server";
import type { Community } from "@/types/community";
import { getMockViewer } from "@/mocks/session";
import { mockCommunities, toCommunity } from "@/mocks/communities";

export async function getCommunities(): Promise<Community[]> {
  await connection();
  const viewer = await getMockViewer();

  return mockCommunities
    .flatMap((record) => {
      const community = toCommunity(record, viewer?.id ?? null);
      return community ? [community] : [];
    })
    .sort((a, b) => b.memberCount - a.memberCount);
}
