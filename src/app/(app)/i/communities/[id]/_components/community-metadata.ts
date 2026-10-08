import type { Metadata } from "next";
import { getCommunity } from "@/features/communities/api/get-community";

export async function communityMetadata(
  params: Promise<{ id: string }>,
  suffix = "",
): Promise<Metadata> {
  const { id } = await params;
  const community = await getCommunity(id);
  if (!community) return { title: "Page not found / X" };
  return { title: `${community.name}${suffix} / X` };
}
