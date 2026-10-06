import type { ToggleFollow } from "@/types/user";
import { UserCell } from "@/components/user/user-cell";
import { ConnectHeader } from "@/features/connect/components/connect-header";
import { ConnectPeopleList } from "@/features/connect/components/connect-people-list";
import { ConnectSectionTitle } from "@/features/connect/components/connect-section-title";
import { ConnectTabs } from "@/features/connect/components/connect-tabs";
import type { ConnectPeoplePage } from "@/features/connect/types/connect";

type ConnectPeopleProps = {
  page: ConnectPeoplePage;
  viewerId: string;
  toggleFollow: ToggleFollow;
};

export function ConnectPeople({ page, viewerId, toggleFollow }: ConnectPeopleProps) {
  const { tab, seed, sectionTitle, users } = page;

  return (
    <>
      <ConnectHeader>
        <ConnectTabs active={tab} />
      </ConnectHeader>
      <div className="pt-2">
        {seed ? (
          <section>
            <ConnectSectionTitle>Follow</ConnectSectionTitle>
            <UserCell user={seed} viewerId={viewerId} toggleFollow={toggleFollow} />
            <div className="my-1 h-px bg-border" />
          </section>
        ) : null}
        <section>
          {sectionTitle ? (
            <ConnectSectionTitle>{sectionTitle}</ConnectSectionTitle>
          ) : null}
          <ConnectPeopleList
            key={`${tab}:${seed?.id ?? ""}`}
            tab={tab}
            excludeId={seed?.id ?? null}
            firstPage={users}
            viewerId={viewerId}
            toggleFollow={toggleFollow}
          />
        </section>
      </div>
    </>
  );
}
