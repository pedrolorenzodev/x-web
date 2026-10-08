"use client";

import {
  startTransition,
  useOptimistic,
  useState,
  type SyntheticEvent,
} from "react";
import type { ToggleFollow } from "@/types/user";
import { Button } from "@/components/ui/button";
import { ConfirmSheet } from "@/components/ui/confirm-sheet";
import { cn } from "@/lib/utils";

type FollowButtonProps = {
  userId: string;
  handle: string;
  following: boolean;
  toggleFollow: ToggleFollow;
  size?: "sm" | "md";
  className?: string;
};

function stopPropagation(event: SyntheticEvent) {
  event.stopPropagation();
}

export function FollowButton({
  userId,
  handle,
  following,
  toggleFollow,
  size = "sm",
  className,
}: FollowButtonProps) {
  const [optimisticFollowing, setOptimisticFollowing] = useOptimistic(following);
  const [confirming, setConfirming] = useState(false);
  const [justFollowed, setJustFollowed] = useState(false);

  function toggle() {
    startTransition(async () => {
      setOptimisticFollowing(!optimisticFollowing);
      await toggleFollow(userId);
    });
  }

  function confirmUnfollow() {
    setConfirming(false);
    toggle();
  }

  if (!optimisticFollowing) {
    return (
      <Button
        size={size}
        aria-label={`Follow @${handle}`}
        onClick={() => {
          setJustFollowed(true);
          toggle();
        }}
        onPointerDown={stopPropagation}
        className={cn("relative shrink-0", className)}
      >
        Follow
      </Button>
    );
  }

  return (
    <>
      <Button
        size={size}
        variant="outline"
        aria-label={`Following @${handle}`}
        onClick={() => setConfirming(true)}
        onPointerDown={stopPropagation}
        onPointerLeave={() => setJustFollowed(false)}
        data-armed={justFollowed ? undefined : ""}
        className={cn(
          "group/follow relative shrink-0 border-outline data-armed:hover:border-danger-border data-armed:hover:bg-danger/10 data-armed:hover:text-danger",
          className,
        )}
      >
        <span className="grid">
          <span className="col-start-1 row-start-1 group-data-armed/follow:group-hover/follow:invisible">
            Following
          </span>
          <span className="invisible col-start-1 row-start-1 group-data-armed/follow:group-hover/follow:visible">
            Unfollow
          </span>
        </span>
      </Button>
      {confirming ? (
        <span
          className="contents"
          onClick={stopPropagation}
          onPointerDown={stopPropagation}
        >
          <ConfirmSheet
            title={`Unfollow @${handle}?`}
            body="Their posts will no longer show up in your Following timeline. You can still view their profile, unless their posts are protected."
            confirmLabel="Unfollow"
            onConfirm={confirmUnfollow}
            onCancel={() => setConfirming(false)}
          />
        </span>
      ) : null}
    </>
  );
}
