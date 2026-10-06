import { connection } from "next/server";
import { findUserById, toUser } from "@/mocks/users";
import { findFollowedByPreview } from "@/mocks/follows";
import { getMockViewer } from "@/mocks/session";
import { getConnectUsers } from "@/features/connect/api/get-connect-users";
import type {
  ConnectPeoplePage,
  ConnectQuery,
} from "@/features/connect/types/connect";

function sectionTitle({ tab, seedName }: { tab: ConnectQuery["tab"]; seedName: string | null }) {
  if (tab === "creators") return null;
  return seedName ? `Similar to ${seedName}` : "Suggested for you";
}

export async function getConnectPeople({
  tab,
  userId,
}: ConnectQuery): Promise<ConnectPeoplePage> {
  await connection();
  const viewer = await getMockViewer();
  const seedRecord =
    tab === "who-to-follow" && userId && userId !== viewer?.id
      ? findUserById(userId)
      : null;
  const seed = seedRecord
    ? toUser(seedRecord, findFollowedByPreview(seedRecord.id))
    : null;

  return {
    tab,
    seed,
    sectionTitle: sectionTitle({ tab, seedName: seed?.displayName ?? null }),
    users: await getConnectUsers(tab, seed?.id ?? null),
  };
}
