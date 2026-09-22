import { Suspense } from "react";
import type { User } from "@/types/user";
import { RightPanel } from "@/components/layout/right-panel/right-panel";
import { RelevantPeople } from "@/components/layout/right-panel/relevant-people";
import { TrendsCard } from "@/components/layout/right-panel/trends-card";
import { getSession } from "@/features/auth/api/get-session";
import { getProfile } from "@/features/profile/api/get-profile";
import { getConversation } from "@/features/tweet/api/get-conversation";

async function People({
  params,
}: {
  params: PageProps<"/[handle]/status/[id]">["params"];
}) {
  const { id } = await params;
  const [conversation, session] = await Promise.all([
    getConversation(id),
    getSession(),
  ]);
  if (!conversation || !session) return null;

  const { author, replyingTo } = conversation.tweet;
  const handles = [author.handle];
  if (replyingTo && replyingTo.id !== author.id) {
    handles.push(replyingTo.handle);
  }

  const profiles = await Promise.all(handles.map(getProfile));
  const people = profiles.filter(
    (profile): profile is User => profile !== null,
  );

  return <RelevantPeople people={people} viewerId={session.user.id} />;
}

export default function TweetPanel({
  params,
}: PageProps<"/[handle]/status/[id]">) {
  return (
    <RightPanel>
      <Suspense fallback={null}>
        <People params={params} />
      </Suspense>
      <TrendsCard />
    </RightPanel>
  );
}
