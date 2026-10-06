import Image from "next/image";
import Link from "next/link";
import type { UserSummary } from "@/types/user";
import { routes } from "@/config/routes";
import {
  LockIcon,
  VerifiedGoldIcon,
  VerifiedGreyIcon,
  VerifiedIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type UserBadgesProps = {
  user: Pick<UserSummary, "verified" | "protected" | "affiliate">;
  size?: "sm" | "md";
  className?: string;
};

const iconSizes = { sm: "size-[18.75px]", md: "size-5" } as const;

export function UserBadges({ user, size = "sm", className }: UserBadgesProps) {
  const icon = iconSizes[size];
  if (!user.verified && !user.protected && !user.affiliate) return null;

  return (
    <span className={cn("inline-flex shrink-0 items-center", className)}>
      {user.protected ? (
        <LockIcon
          aria-label="Protected account"
          className={cn(icon, "ml-0.5")}
        />
      ) : null}
      {user.verified === "blue" ? (
        <VerifiedIcon
          aria-label="Verified account"
          className={cn(icon, "ml-0.5 text-accent")}
        />
      ) : null}
      {user.verified === "business" ? (
        <VerifiedGoldIcon
          aria-label="Verified account"
          className={cn(icon, "ml-0.5")}
        />
      ) : null}
      {user.verified === "government" ? (
        <VerifiedGreyIcon
          aria-label="Verified account"
          className={cn(icon, "ml-0.5")}
        />
      ) : null}
      {user.affiliate ? (
        <Link
          href={routes.profile(user.affiliate.handle)}
          className="relative ml-1 flex"
        >
          <Image
            src={user.affiliate.avatarUrl}
            alt={`@${user.affiliate.handle}`}
            width={14}
            height={14}
            className="size-[13.94px] rounded-[2px] border border-border"
          />
        </Link>
      ) : null}
    </span>
  );
}
