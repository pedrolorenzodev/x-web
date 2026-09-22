import type { ReactNode } from "react";
import type { User } from "@/types/user";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileHeader } from "@/features/profile/components/profile-header";
import {
  ProfileTabs,
  type ProfileTab,
} from "@/features/profile/components/profile-tabs";
import { formatProfileCount } from "@/utils/format-profile-count";

type ProfileScreenProps = {
  profile: User;
  isViewer: boolean;
  tab: ProfileTab;
  children: ReactNode;
};

export function ProfileScreen({
  profile,
  isViewer,
  tab,
  children,
}: ProfileScreenProps) {
  const posts = profile.postsCount === 1 ? "post" : "posts";

  return (
    <>
      <PageHeader
        title={profile.displayName}
        subtitle={`${formatProfileCount(profile.postsCount)} ${posts}`}
      />
      <ProfileHeader profile={profile} isViewer={isViewer} />
      <ProfileTabs handle={profile.handle} active={tab} />
      <div className="pb-[200px]">{children}</div>
    </>
  );
}
