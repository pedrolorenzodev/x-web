"use client";

import { startTransition, useOptimistic } from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, PlusIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { toggleListFollow } from "@/features/lists/api/list-viewer-state";

type ListFollowButtonProps = {
  listId: string;
  following: boolean;
  variant?: "circle" | "pill";
};

export function ListFollowButton({
  listId,
  following,
  variant = "circle",
}: ListFollowButtonProps) {
  const [optimisticFollowing, setOptimisticFollowing] = useOptimistic(following);

  function toggle() {
    startTransition(async () => {
      setOptimisticFollowing(!optimisticFollowing);
      await toggleListFollow(listId);
    });
  }

  if (variant === "pill") {
    return optimisticFollowing ? (
      <Button
        variant="outline"
        aria-label="Unfollow List"
        onClick={toggle}
        className="group/follow duration-200 ease-[ease] hover:border-danger-border hover:bg-danger/10 hover:text-danger"
      >
        <span className="grid">
          <span className="col-start-1 row-start-1 group-hover/follow:invisible">
            Following
          </span>
          <span className="invisible col-start-1 row-start-1 group-hover/follow:visible">
            Unfollow
          </span>
        </span>
      </Button>
    ) : (
      <Button aria-label="Follow List" onClick={toggle}>
        Follow
      </Button>
    );
  }

  return (
    <button
      type="button"
      aria-label={optimisticFollowing ? "Unfollow" : "Follow"}
      aria-pressed={optimisticFollowing}
      onClick={toggle}
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ease-[ease]",
        optimisticFollowing
          ? "border border-border-strong text-foreground hover:bg-foreground/10"
          : "bg-foreground text-background hover:bg-inverted-hover",
      )}
    >
      {optimisticFollowing ? (
        <CheckIcon className="size-[18.75px]" />
      ) : (
        <PlusIcon className="size-[18.75px]" />
      )}
    </button>
  );
}
