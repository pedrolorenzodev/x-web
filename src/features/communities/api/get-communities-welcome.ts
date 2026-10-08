import { connection } from "next/server";
import { getMockViewer } from "@/mocks/session";
import { communitiesWelcomeDismissedBy } from "@/mocks/communities";

export async function shouldShowCommunitiesWelcome() {
  await connection();
  const viewer = await getMockViewer();
  return viewer ? !communitiesWelcomeDismissedBy.has(viewer.id) : false;
}
