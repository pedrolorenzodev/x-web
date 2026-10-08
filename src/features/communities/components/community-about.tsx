import Link from "next/link";
import type { ReactNode } from "react";
import type { Community, CommunityMember } from "@/types/community";
import type { ToggleFollow } from "@/types/user";
import { routes } from "@/config/routes";
import {
  CalendarIcon,
  CommunitiesFillIcon,
  GlobeIcon,
} from "@/components/ui/icons";
import { UserBadges } from "@/components/ui/verified-badge";
import { communityLinks } from "@/features/communities/config/links";
import { MemberCell } from "@/features/communities/components/member-cell";
import { formatCreatedDate } from "@/features/communities/utils/format-created-date";

const PREVIEW_MEMBERS = 3;

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-border pb-1 not-first:pt-[3px]">
      <h2 className="px-4 pt-[13px] pb-3 text-xl font-extrabold">{title}</h2>
      {children}
    </section>
  );
}

function InfoRow({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-5 py-3 pr-4 pl-[30px] text-base">
      <span className="flex size-6 shrink-0 items-center text-muted [&>svg]:size-6">
        {icon}
      </span>
      <div className="flex min-h-8 min-w-0 flex-col justify-center">
        {children}
      </div>
    </div>
  );
}

function ShowMore({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="flex h-13 items-center px-4 text-base text-accent transition-colors duration-200 ease-[ease] hover:bg-white/3"
    >
      Show more
    </Link>
  );
}

type CommunityAboutProps = {
  community: Community;
  members: CommunityMember[];
  viewerId: string;
  toggleFollow: ToggleFollow;
};

export function CommunityAbout({
  community,
  members,
  viewerId,
  toggleFollow,
}: CommunityAboutProps) {
  const moderators = members.filter((member) => member.role !== "member");
  const regulars = members.filter((member) => member.role === "member");

  return (
    <div className="pb-[200px]">
      <Section title="Community Info">
        <InfoRow icon={<CommunitiesFillIcon />}>Only members can post.</InfoRow>
        <InfoRow icon={<GlobeIcon />}>
          <p className="font-bold">All Communities are publicly visible.</p>
          <p className="mt-1 text-muted">
            {community.joinPolicy === "open"
              ? "Anyone can join this Community."
              : "People need to be approved to join this Community."}
          </p>
        </InfoRow>
        <InfoRow icon={<CalendarIcon />}>
          <p>
            <span className="text-muted">
              Created {formatCreatedDate(community.createdAt)} by{" "}
            </span>
            <Link
              href={routes.profile(community.createdBy.handle)}
              className="inline-flex items-center font-bold hover:underline"
            >
              @{community.createdBy.handle}
              <UserBadges user={community.createdBy} />
            </Link>
          </p>
        </InfoRow>
      </Section>

      <Section title="Rules">
        <p className="px-4 pt-3 pb-6 text-base">
          These are set and enforced by Community admins and are in addition to{" "}
          <a
            href={communityLinks.rules}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            X’s rules
          </a>
          .
        </p>
        <ol>
          {community.rules.map((rule, index) => (
            <li key={rule.title} className="flex gap-4 py-3 pr-4 pl-[26px]">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-menu-hover text-base font-bold">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-base font-bold">{rule.title}</p>
                <p className="mt-1 text-base text-muted">{rule.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Moderators">
        {moderators.map((member) => (
          <MemberCell
            key={member.user.id}
            member={member}
            viewerId={viewerId}
            toggleFollow={toggleFollow}
            showRole={false}
            showBio
          />
        ))}
        <ShowMore href={routes.communityModerators(community.id)} />
      </Section>

      {regulars.length > 0 ? (
        <Section title="Members">
          {regulars.slice(0, PREVIEW_MEMBERS).map((member) => (
            <MemberCell
              key={member.user.id}
              member={member}
              viewerId={viewerId}
              toggleFollow={toggleFollow}
              showRole={false}
              showBio
            />
          ))}
          <ShowMore href={routes.communityMembers(community.id)} />
        </Section>
      ) : null}
    </div>
  );
}
