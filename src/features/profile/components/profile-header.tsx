import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import type { User } from "@/types/user";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  ChatIcon,
  MoreHorizontalIcon,
} from "@/components/ui/icons";
import { formatJoinedDate } from "@/utils/format-joined-date";
import { formatProfileCount } from "@/utils/format-profile-count";

type ProfileHeaderProps = {
  profile: User;
  isViewer: boolean;
};

type CircleButtonProps = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

function CircleButton({ label, icon: Icon }: CircleButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-full border border-border-strong transition-colors duration-200 ease-[ease] hover:bg-foreground/10"
    >
      <Icon className="size-5" />
    </button>
  );
}

function Count({ value, label }: { value: number; label: string }) {
  return (
    <span className="cursor-pointer text-sm hover:underline">
      <span className="font-bold">{formatProfileCount(value)}</span>{" "}
      <span className="text-muted">{label}</span>
    </span>
  );
}

export function ProfileHeader({ profile, isViewer }: ProfileHeaderProps) {
  return (
    <div>
      <div className="relative aspect-[3/1] w-full bg-border-strong">
        {profile.bannerUrl ? (
          <Image
            src={profile.bannerUrl}
            alt=""
            fill
            sizes="600px"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="mb-4 px-4 pt-3">
        <div className="flex items-start justify-between">
          <div className="relative -mt-[84.9px] mb-3 flex rounded-full bg-background p-1">
            <Avatar
              src={profile.avatarUrl}
              alt={profile.displayName}
              size="xl"
            />
          </div>

          <div className="mb-3 flex gap-2">
            {isViewer ? (
              <Button variant="outline">Edit profile</Button>
            ) : (
              <>
                <CircleButton label="More" icon={MoreHorizontalIcon} />
                <CircleButton label="Message" icon={ChatIcon} />
                <Button
                  variant={profile.followedByViewer ? "outline" : "primary"}
                >
                  {profile.followedByViewer ? "Following" : "Follow"}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="mt-1 mb-3 flex flex-col">
          <h1 className="text-xl font-extrabold">{profile.displayName}</h1>
          <span className="text-base text-muted">@{profile.handle}</span>
        </div>

        {profile.bio ? (
          <p className="mb-3 text-base break-words whitespace-pre-wrap">
            {profile.bio}
          </p>
        ) : null}

        <div className="mb-3 flex items-center gap-1 text-base leading-3 text-muted">
          <CalendarIcon className="size-[18.75px]" />
          {formatJoinedDate(profile.joinedAt)}
        </div>

        <div className="flex h-5 items-center gap-5">
          <Count value={profile.followingCount} label="Following" />
          <Count value={profile.followersCount} label="Followers" />
        </div>
      </div>
    </div>
  );
}
