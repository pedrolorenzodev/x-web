import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { UserBadges } from "@/components/ui/verified-badge";
import { getFollowListScreen } from "@/features/profile/api/get-follow-lists";
import { toggleFollow } from "@/features/profile/api/toggle-follow";
import {
  FollowListEmpty,
  FollowListProtected,
} from "@/features/profile/components/follow-list-empty";
import { FollowListTabs } from "@/features/profile/components/follow-list-tabs";
import { FollowListUsers } from "@/features/profile/components/follow-list-users";
import { ProfileNotFound } from "@/features/profile/components/profile-not-found";
import type { FollowListKind } from "@/features/profile/types/follow-list";
import { followListHref } from "@/features/profile/utils/follow-list";

type FollowListScreenProps = {
  handle: string;
  kind: FollowListKind;
};

export async function FollowListScreen({ handle, kind }: FollowListScreenProps) {
  const data = await getFollowListScreen(handle, kind);
  if (!data) return <ProfileNotFound />;

  const { profile, viewerId, isViewer, locked, hasFollowersYouKnow, firstPage } =
    data;
  if (profile.handle !== handle) redirect(followListHref[kind](profile.handle));

  return (
    <>
      <PageHeader
        title={
          <span className="flex min-w-0 items-center">
            <span className="truncate">{profile.displayName}</span>
            <UserBadges user={profile} size="md" />
          </span>
        }
        subtitle={`@${profile.handle}`}
      >
        <FollowListTabs
          handle={profile.handle}
          active={kind}
          showFollowersYouKnow={hasFollowersYouKnow}
        />
      </PageHeader>
      {locked ? (
        <FollowListProtected handle={profile.handle} />
      ) : firstPage.items.length === 0 ? (
        <FollowListEmpty kind={kind} handle={profile.handle} isViewer={isViewer} />
      ) : (
        <FollowListUsers
          key={`${profile.id}:${kind}`}
          handle={profile.handle}
          kind={kind}
          firstPage={firstPage}
          viewerId={viewerId}
          toggleFollow={toggleFollow}
        />
      )}
    </>
  );
}
