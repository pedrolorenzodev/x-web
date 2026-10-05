import { connection } from "next/server";
import type { List } from "@/types/list";
import { getMockViewer } from "@/mocks/session";
import { mockLists, toList } from "@/mocks/lists";

export async function getList(id: string): Promise<List | null> {
  await connection();
  const viewer = await getMockViewer();

  const record = mockLists.find((item) => item.id === id);
  if (!record || (record.private && record.ownerId !== viewer?.id)) {
    return null;
  }

  return toList(record);
}
