"use server";

import { refresh } from "next/cache";
import { getMockViewer } from "@/mocks/session";
import {
  communitiesWelcomeDismissedBy,
  findCommunity,
} from "@/mocks/communities";

export async function toggleCommunityMembership(communityId: string) {
  const record = findCommunity(communityId);
  const viewer = await getMockViewer();
  if (!record || !viewer) return;

  const index = record.members.findIndex((member) => member.userId === viewer.id);
  if (index === -1) {
    record.members.push({ userId: viewer.id, role: "member" });
    record.memberCount += 1;
  } else if (record.members[index].role === "member") {
    record.members.splice(index, 1);
    record.memberCount -= 1;
    record.pinnedBy = record.pinnedBy.filter((id) => id !== viewer.id);
  }
  refresh();
}

export async function toggleCommunityPin(communityId: string) {
  const record = findCommunity(communityId);
  const viewer = await getMockViewer();
  if (!record || !viewer) return;

  record.pinnedBy = record.pinnedBy.includes(viewer.id)
    ? record.pinnedBy.filter((id) => id !== viewer.id)
    : [...record.pinnedBy, viewer.id];
  refresh();
}

export async function dismissCommunitiesWelcome() {
  const viewer = await getMockViewer();
  if (!viewer) return;
  communitiesWelcomeDismissedBy.add(viewer.id);
}
