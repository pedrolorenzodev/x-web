import { Suspense } from "react";
import { PanelNews } from "@/app/(app)/@panel/_modules/panel-news";
import { RelevantPeople } from "@/components/layout/right-panel/relevant-people";
import { RightPanel } from "@/components/layout/right-panel/right-panel";
import { getSession } from "@/features/auth/api/get-session";
import { getNewsStory } from "@/features/explore/api/get-news-story";
import { toggleFollow } from "@/features/profile/api/toggle-follow";

async function StoryPeople({ params }: Pick<PageProps<"/i/trending/[id]">, "params">) {
  const [detail, session] = await Promise.all([
    params.then(({ id }) => getNewsStory(id)),
    getSession(),
  ]);
  if (!detail?.relevantPeople.length || !session) return null;

  return (
    <RelevantPeople
      people={detail.relevantPeople}
      viewerId={session.user.id}
      toggleFollow={toggleFollow}
    />
  );
}

export default function NewsStoryPanel({ params }: PageProps<"/i/trending/[id]">) {
  return (
    <RightPanel>
      <Suspense fallback={null}>
        <StoryPeople params={params} />
      </Suspense>
      <Suspense fallback={null}>
        <PanelNews />
      </Suspense>
    </RightPanel>
  );
}
