"use client";

import { startTransition, useOptimistic } from "react";
import { CheckIcon, PlusIcon } from "@/components/ui/icons";

type ListFollowButtonProps = {
  listId: string;
  following: boolean;
  toggleListFollow: (listId: string) => Promise<void>;
};

export function ListFollowButton({
  listId,
  following,
  toggleListFollow,
}: ListFollowButtonProps) {
  const [optimisticFollowing, setOptimisticFollowing] = useOptimistic(following);

  function toggle() {
    startTransition(async () => {
      setOptimisticFollowing(!optimisticFollowing);
      await toggleListFollow(listId);
    });
  }

  return (
    <button
      type="button"
      aria-label={optimisticFollowing ? "Unfollow" : "Follow"}
      aria-pressed={optimisticFollowing}
      onClick={toggle}
      className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-colors duration-200 ease-[ease] hover:bg-inverted-hover"
    >
      {optimisticFollowing ? (
        <CheckIcon className="size-[18px]" />
      ) : (
        <PlusIcon className="size-[18px]" />
      )}
    </button>
  );
}
