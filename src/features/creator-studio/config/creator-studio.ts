import type { ComponentType, SVGProps } from "react";
import { routes } from "@/config/routes";
import {
  GiftIcon,
  HelpCircleIcon,
  InspirationIcon,
  LiveStudioIcon,
  PersonStarIcon,
  SupportChatIcon,
  ViewsIcon,
} from "@/components/ui/icons";

export type CreatorStudioBadge = "ineligible" | "new";

export type CreatorStudioRow = {
  title: string;
  subtitle?: string;
  badge?: CreatorStudioBadge;
  href: string;
  external?: boolean;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export type CreatorStudioSection = {
  title: string;
  rows: CreatorStudioRow[];
};

export const creatorStudioSections: CreatorStudioSection[] = [
  {
    title: "Programs",
    rows: [
      {
        title: "Original Content Rewards",
        subtitle: "Earn from your posts",
        badge: "ineligible",
        href: routes.creatorPaywall("original_content_rewards"),
        icon: GiftIcon,
      },
      {
        title: "Subscriptions",
        badge: "ineligible",
        href: routes.creatorPaywall("subscription"),
        icon: PersonStarIcon,
      },
    ],
  },
  {
    title: "Tools",
    rows: [
      {
        title: "Live Studio",
        subtitle: "Go live professionally",
        badge: "new",
        href: routes.premiumFrom("x_studio"),
        icon: LiveStudioIcon,
      },
      {
        title: "Analytics",
        href: routes.creatorAnalyticsPaywall,
        icon: ViewsIcon,
      },
      {
        title: "Inspiration",
        subtitle: "Top posts by engagement",
        href: routes.creatorInspiration,
        icon: InspirationIcon,
      },
    ],
  },
  {
    title: "Support",
    rows: [
      {
        title: "Contact support",
        href: routes.chat,
        icon: SupportChatIcon,
      },
      {
        title: "Learn more",
        href: "https://help.x.com/en/using-x#creators",
        external: true,
        icon: HelpCircleIcon,
      },
    ],
  },
];

export type MonetizationProduct = "original_content_rewards" | "subscription";

export type MonetizationPaywall = {
  body: string;
  eligibility: string;
};

export const monetizationPaywalls: Record<
  MonetizationProduct,
  MonetizationPaywall
> = {
  original_content_rewards: {
    body: "The first step to earning from Original Content Rewards is getting Verified with X Premium.",
    eligibility: "Check Original Content Rewards eligibility",
  },
  subscription: {
    body: "The first step to monetization is getting Verified with X Premium.",
    eligibility: "Check Subscriptions eligibility",
  },
};

export const monetizationCards = [
  {
    title: "Get paid to post",
    body: "Earn from sharing high quality content. The more you engage users on X, the more you earn.",
    imageUrl:
      "https://abs.twimg.com/responsive-web/client-web/monetization-image-rev-share.2d15ac6a.png",
  },
  {
    title: "Build a fanbase",
    body: "Offer exclusive content to your biggest supporters and earn recurring income.",
    imageUrl:
      "https://abs.twimg.com/responsive-web/client-web/monetization-image-subscribers.c992566a.png",
  },
];

export const analyticsPaywall = {
  title: "Advanced analytics with X Premium",
  body: "See your profile analytics, understand your audience and more. Upgrade to continue.",
  imageUrl: "https://pbs.twimg.com/onboarding/premium_nux/analytics_v1.png",
};

export const creatorHelpUrl = "https://help.x.com/en/using-x#creators";

export const inspirationCountry = "🇦🇷 ARG";
