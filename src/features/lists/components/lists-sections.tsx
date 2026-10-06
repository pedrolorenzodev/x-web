import type { List } from "@/types/list";
import { ModuleHeader, ShowMoreRow } from "@/components/ui/module";
import { ListCell } from "@/features/lists/components/list-cell";
import { ListFollowButton } from "@/features/lists/components/list-follow-button";
import { ListPinButton } from "@/features/lists/components/list-pin-button";

export function DiscoverListsSection({
  lists,
  showMore = true,
}: {
  lists: List[];
  showMore?: boolean;
}) {
  if (!lists.length) return null;

  return (
    <section>
      <ModuleHeader>Discover new Lists</ModuleHeader>
      {lists.map((list) => (
        <ListCell
          key={list.id}
          list={list}
          social="followers"
          action={
            <ListFollowButton listId={list.id} following={list.followedByViewer} />
          }
        />
      ))}
      {showMore ? (
        <>
          <ShowMoreRow href="/i/lists/suggested" />
          <div aria-hidden className="mt-[9px] h-px bg-border" />
        </>
      ) : null}
    </section>
  );
}

export function YourListsSection({ lists }: { lists: List[] }) {
  return (
    <section>
      <ModuleHeader>Your Lists</ModuleHeader>
      {lists.length ? (
        lists.map((list) => (
          <ListCell
            key={list.id}
            list={list}
            social="owner"
            action={<ListPinButton listId={list.id} pinned={list.pinnedByViewer} />}
          />
        ))
      ) : (
        <p
          data-testid="inlinePrompt"
          className="p-8 text-center text-base text-muted"
        >
          You haven&apos;t created or followed any Lists. When you do, they&apos;ll
          show up here.
        </p>
      )}
    </section>
  );
}

export function UserListsSection({ lists }: { lists: List[] }) {
  if (!lists.length) {
    return (
      <p className="p-8 text-center text-base text-muted">
        This account hasn&apos;t created any public Lists yet.
      </p>
    );
  }

  return lists.map((list) => (
    <ListCell
      key={list.id}
      list={list}
      social={list.followersPreview.length ? "followers" : "owner"}
      showMemberCount
    />
  ));
}
