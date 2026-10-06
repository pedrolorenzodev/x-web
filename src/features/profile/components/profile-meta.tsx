import Link from "next/link";
import type { ReactNode } from "react";
import type { User } from "@/types/user";
import { routes } from "@/config/routes";
import {
  BalloonIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChevronRightIcon,
  LinkIcon,
  LocationIcon,
} from "@/components/ui/icons";
import { formatJoinedDate } from "@/utils/format-joined-date";
import { formatBirthday } from "@/features/profile/utils/format-birthday";

const icon = "size-[18.75px] shrink-0";

function MetaItem({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="flex items-center gap-1">
      {icon}
      {children}
    </span>
  );
}

type ProfileMetaProps = {
  profile: User;
  isViewer: boolean;
};

export function ProfileMeta({ profile, isViewer }: ProfileMetaProps) {
  const birthday = formatBirthday(profile, isViewer);

  return (
    <div className="mb-3 flex flex-wrap gap-x-3 gap-y-1 text-base leading-5 text-muted">
      {profile.professionalCategory ? (
        <MetaItem icon={<BriefcaseIcon className={icon} />}>
          {profile.professionalCategory}
        </MetaItem>
      ) : null}
      {profile.location ? (
        <MetaItem icon={<LocationIcon className={icon} />}>
          {profile.location}
        </MetaItem>
      ) : null}
      {profile.website ? (
        <MetaItem icon={<LinkIcon className={icon} />}>
          <a
            href={profile.website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            {profile.website.display}
          </a>
        </MetaItem>
      ) : null}
      {birthday ? (
        <MetaItem icon={<BalloonIcon className={icon} />}>{birthday}</MetaItem>
      ) : null}
      <Link
        href={routes.profileAbout(profile.handle)}
        className="group/joined flex items-center gap-1"
      >
        <CalendarIcon className={icon} />
        <span className="group-hover/joined:underline">
          {formatJoinedDate(profile.joinedAt)}
        </span>
        <ChevronRightIcon className={icon} />
      </Link>
    </div>
  );
}
