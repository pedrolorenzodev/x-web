import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar } from "@/components/ui/avatar";
import {
  CalendarIcon,
  ChevronRightIcon,
  GlobeMeridiansIcon,
  PremiumIcon,
  SettingsIcon,
} from "@/components/ui/icons";
import { UserBadges } from "@/components/ui/verified-badge";
import { legalLinks } from "@/config/links";
import { routes } from "@/config/routes";
import type { User } from "@/types/user";
import { formatMonthYear } from "@/utils/format-month-year";
import {
  AboutRowContent,
  aboutRowInteractive,
} from "@/features/profile/components/about-account-row";
import { AccountBasedInRow } from "@/features/profile/components/account-based-in-row";

type AboutAccountScreenProps = {
  profile: User;
  isViewer: boolean;
};

export function AboutAccountScreen({ profile, isViewer }: AboutAccountScreenProps) {
  return (
    <>
      <PageHeader
        title={isViewer ? "About your account" : "About this account"}
        action={
          isViewer ? (
            <Link
              href={routes.settingsAboutYourAccount}
              aria-label="Settings"
              className="flex size-9 items-center justify-center rounded-full transition-colors duration-200 ease-[ease] hover:bg-foreground/10"
            >
              <SettingsIcon className="size-5" />
            </Link>
          ) : null
        }
      />
      <div className="flex flex-col gap-5">
        <div className="m-5 flex flex-col items-center gap-2">
          <Avatar src={profile.avatarUrl} alt="" size="lg" />
          <div className="flex min-w-0 flex-col items-center text-base">
            <span className="flex max-w-full items-center">
              <span className="truncate font-bold">{profile.displayName}</span>
              <UserBadges user={profile} />
            </span>
            <span className="text-muted">@{profile.handle}</span>
          </div>
        </div>
        <AboutRowContent
          icon={<CalendarIcon />}
          title="Date joined"
          value={formatMonthYear(profile.joinedAt)}
        />
        {profile.accountBasedIn ? (
          <AccountBasedInRow country={profile.accountBasedIn} />
        ) : null}
        {profile.verified && profile.verifiedSince ? (
          <a
            href={legalLinks.verifiedAccountsHelp}
            target="_blank"
            rel="noopener noreferrer"
            className={aboutRowInteractive}
          >
            <AboutRowContent
              icon={<PremiumIcon />}
              title="Verified"
              value={`Since ${formatMonthYear(profile.verifiedSince)}`}
              trailing={<ChevronRightIcon className="box-content size-[18.75px] pl-3" />}
            />
          </a>
        ) : null}
        {profile.affiliate ? (
          <AboutRowContent
            icon={
              <Image
                src={profile.affiliate.avatarUrl}
                alt=""
                width={24}
                height={24}
                className="rounded-[2px] border border-border"
              />
            }
            title={
              <>
                An affiliate of{" "}
                <Link
                  href={routes.profile(profile.affiliate.handle)}
                  className="font-bold text-accent hover:underline"
                >
                  @{profile.affiliate.handle}
                </Link>
              </>
            }
          />
        ) : null}
        {profile.connectedVia ? (
          <AboutRowContent
            icon={<GlobeMeridiansIcon />}
            title="Connected via"
            value={profile.connectedVia}
          />
        ) : null}
      </div>
    </>
  );
}
