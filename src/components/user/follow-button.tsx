"use client";

import { startTransition, useOptimistic } from "react";
import type { ToggleFollow } from "@/types/user";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FollowButtonProps = {
  userId: string;
  handle: string;
  following: boolean;
  toggleFollow: ToggleFollow;
  size?: "sm" | "md";
  className?: string;
};

export function FollowButton({
  userId,
  handle,
  following,
  toggleFollow,
  size = "sm",
  className,
}: FollowButtonProps) {
  const [optimisticFollowing, setOptimisticFollowing] = useOptimistic(following);

  function toggle() {
    startTransition(async () => {
      setOptimisticFollowing(!optimisticFollowing);
      await toggleFollow(userId);
    });
  }

  if (!optimisticFollowing) {
    return (
      <Button
        size={size}
        aria-label={`Follow @${handle}`}
        onClick={toggle}
        className={cn("relative shrink-0", className)}
      >
        Follow
      </Button>
    );
  }

  return (
    <Button
      size={size}
      variant="outline"
      aria-label={`Following @${handle}`}
      onClick={toggle}
      className={cn(
        "group/follow relative shrink-0 duration-200 ease-[ease] hover:border-danger-border hover:bg-danger/10 hover:text-danger",
        className,
      )}
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
  );
}
