import { Tab } from "@/components/ui/tab";
import { TabBar } from "@/components/ui/tab-bar";
import type { FollowListKind } from "@/features/profile/types/follow-list";
import {
  followListHref,
  followListLabel,
} from "@/features/profile/utils/follow-list";

type FollowListTabsProps = {
  handle: string;
  active: FollowListKind;
  showFollowersYouKnow: boolean;
};

export function FollowListTabs({
  handle,
  active,
  showFollowersYouKnow,
}: FollowListTabsProps) {
  const kinds: FollowListKind[] = showFollowersYouKnow
    ? ["verified_followers", "followers_you_follow", "followers", "following"]
    : ["verified_followers", "followers", "following"];

  return (
    <TabBar label="Followers and following">
      {kinds.map((kind) => (
        <Tab
          key={kind}
          label={followListLabel[kind]}
          href={followListHref[kind](handle)}
          active={kind === active}
        />
      ))}
    </TabBar>
  );
}
