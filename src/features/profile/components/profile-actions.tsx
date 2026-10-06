"use client";

import Link from "next/link";
import { startTransition, useOptimistic } from "react";
import type { ToggleFollow } from "@/types/user";
import { routes } from "@/config/routes";
import { BellCheckIcon, BellPlusIcon, ChatIcon } from "@/components/ui/icons";
import { Tooltip } from "@/components/ui/tooltip";
import { FollowButton } from "@/components/user/follow-button";
import { toggleProfileNotifications } from "@/features/profile/api/toggle-profile-notifications";
import { circleButton } from "@/features/profile/components/circle-button";
import { ProfileMoreMenu } from "@/features/profile/components/profile-more-menu";

type ProfileActionsProps = {
  userId: string;
  handle: string;
  isProtected: boolean;
  following: boolean;
  notificationsOn: boolean;
  toggleFollow: ToggleFollow;
};

export function ProfileActions({
  userId,
  handle,
  isProtected,
  following,
  notificationsOn,
  toggleFollow,
}: ProfileActionsProps) {
  const [state, setState] = useOptimistic({ following, notificationsOn });

  async function toggleFollowing(id: string) {
    setState((current) => ({
      following: !current.following,
      notificationsOn: current.following ? false : current.notificationsOn,
    }));
    await toggleFollow(id);
  }

  function toggleNotifications() {
    startTransition(async () => {
      setState((current) => ({
        ...current,
        notificationsOn: !current.notificationsOn,
      }));
      await toggleProfileNotifications(userId);
    });
  }

  return (
    <>
      <ProfileMoreMenu handle={handle} isProtected={isProtected} />
      <Tooltip label="Message">
        <Link href={routes.chat} aria-label="Message" className={circleButton}>
          <ChatIcon className="size-5" />
        </Link>
      </Tooltip>
      {state.following ? (
        <Tooltip
          label={
            state.notificationsOn
              ? "Turn off notifications"
              : "Turn on notifications"
          }
        >
          <button
            type="button"
            aria-label={
              state.notificationsOn
                ? "Turn off post notifications"
                : "Turn on post notifications"
            }
            onClick={toggleNotifications}
            className={circleButton}
          >
            {state.notificationsOn ? (
              <BellCheckIcon className="size-5" />
            ) : (
              <BellPlusIcon className="size-5" />
            )}
          </button>
        </Tooltip>
      ) : null}
      <FollowButton
        userId={userId}
        handle={handle}
        following={state.following}
        toggleFollow={toggleFollowing}
        size="md"
      />
    </>
  );
}
