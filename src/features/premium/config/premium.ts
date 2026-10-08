import type { ComponentType, SVGProps } from "react";
import {
  AdFreeIcon,
  AnalyticsChartIcon,
  ArticleIcon,
  GrokIcon,
  HandleMarketplaceIcon,
  HighestReplyBoostIcon,
  MoneyIcon,
  PlusCircleIcon,
  PremiumIcon,
  RadarIcon,
  ReplyBoostIcon,
  StarFilledIcon,
  XProIcon,
} from "@/components/ui/icons";

export type BillingPeriod = "monthly" | "annual";
export type PremiumPlanId = "premium" | "premium_plus";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export type PlanFeature = {
  label: string;
  icon: Icon;
  info?: boolean;
  isNew?: boolean;
};

export type PlanPrice = {
  amount: string;
  unit: string;
  detail: string | null;
  summaryAmount: string;
  summaryUnit: string;
  summaryDetail: string;
};

export type PremiumPlan = {
  id: PremiumPlanId;
  name: string;
  promo: string;
  prices: Record<BillingPeriod, PlanPrice>;
  features: PlanFeature[];
};

export const premiumHeadline = {
  before: "Don’t lose ",
  highlight: "50% off",
  after: " your first 2 months",
};

export const premiumPlans: PremiumPlan[] = [
  {
    id: "premium",
    name: "Premium",
    promo: "50% off for 2 months",
    prices: {
      monthly: {
        amount: "$2.50",
        unit: "/ month",
        detail: null,
        summaryAmount: "$2.50",
        summaryUnit: "/ month",
        summaryDetail: "For first 2 months, then $5 billed monthly",
      },
      annual: {
        amount: "$4",
        unit: "/ month",
        detail: "$48 billed annually",
        summaryAmount: "$48",
        summaryUnit: "/ year",
        summaryDetail: "Billed annually",
      },
    },
    features: [
      { label: "Verified checkmark", icon: PremiumIcon },
      { label: "Enhanced Grok access", icon: GrokIcon },
      { label: "Advanced analytics", icon: AnalyticsChartIcon, info: true },
      { label: "Less ads in your feeds", icon: StarFilledIcon },
      { label: "Boosted replies", icon: ReplyBoostIcon, info: true },
      { label: "Write Articles", icon: ArticleIcon },
      { label: "Get paid to post", icon: MoneyIcon },
      { label: "Everything in Basic", icon: PlusCircleIcon },
    ],
  },
  {
    id: "premium_plus",
    name: "Premium+",
    promo: "50% off for 2 months",
    prices: {
      monthly: {
        amount: "$20",
        unit: "/ month",
        detail: null,
        summaryAmount: "$20",
        summaryUnit: "/ month",
        summaryDetail: "For first 2 months, then $40 billed monthly",
      },
      annual: {
        amount: "$32.92",
        unit: "/ month",
        detail: "$395 billed annually",
        summaryAmount: "$395",
        summaryUnit: "/ year",
        summaryDetail: "Billed annually",
      },
    },
    features: [
      { label: "Fully ad-free", icon: AdFreeIcon },
      { label: "SuperGrok", icon: GrokIcon, info: true, isNew: true },
      {
        label: "Handle Marketplace",
        icon: HandleMarketplaceIcon,
        info: true,
        isNew: true,
      },
      { label: "Highest reply boost", icon: HighestReplyBoostIcon, info: true },
      { label: "Radar Advanced Search", icon: RadarIcon, info: true },
      { label: "X Pro", icon: XProIcon, info: true },
      { label: "Everything in Premium", icon: PlusCircleIcon },
    ],
  },
];

export const premiumBusiness = {
  title: "Are you a business?",
  body: "Gain credibility and grow faster with Premium Business",
  action: "Explore Premium Business",
  badgeUrl:
    "https://abs.twimg.com/responsive-web/client-web/premium-business-badge.1f0900098c7f7e9da.png",
};

export type ComparisonValue = boolean | string;

export type ComparisonRow = {
  label: string;
  info?: boolean;
  premium: ComparisonValue;
  premiumPlus: ComparisonValue;
  valueInfo?: boolean;
};

export type ComparisonSection = {
  title: string;
  rows: ComparisonRow[];
};

export const premiumComparison: ComparisonSection[] = [
  {
    title: "Enhanced Experience",
    rows: [
      {
        label: "Ads",
        premium: "Half in For You & Following",
        premiumPlus: "Fully ad-free",
        valueInfo: true,
      },
      { label: "Reply boost", premium: "Larger", premiumPlus: "Largest" },
      { label: "Radar", info: true, premium: false, premiumPlus: true },
      { label: "Edit post", premium: true, premiumPlus: true },
      { label: "Longer posts", premium: true, premiumPlus: true },
      { label: "Background video playback", premium: true, premiumPlus: true },
      { label: "Download videos", premium: true, premiumPlus: true },
    ],
  },
  {
    title: "Grok AI",
    rows: [
      { label: "Usage limits", premium: "Higher", premiumPlus: "Highest" },
      { label: "SuperGrok", info: true, premium: false, premiumPlus: true },
      {
        label: "Early access to new features",
        premium: false,
        premiumPlus: true,
      },
      { label: "Tag @Grok in replies", premium: true, premiumPlus: true },
    ],
  },
  {
    title: "Creator Hub",
    rows: [
      { label: "Write Articles", info: true, premium: true, premiumPlus: true },
      { label: "Get paid to post", info: true, premium: true, premiumPlus: true },
      {
        label: "Creator Subscriptions",
        info: true,
        premium: true,
        premiumPlus: true,
      },
      { label: "X Pro", info: true, premium: false, premiumPlus: true },
      { label: "Media Studio", info: true, premium: true, premiumPlus: true },
      { label: "Analytics", info: true, premium: true, premiumPlus: true },
    ],
  },
  {
    title: "Verification & Security",
    rows: [
      { label: "Checkmark", info: true, premium: true, premiumPlus: true },
      {
        label: "Optional ID verification",
        info: true,
        premium: true,
        premiumPlus: true,
      },
    ],
  },
  {
    title: "Customization",
    rows: [
      {
        label: "X Handle Marketplace",
        info: true,
        premium: false,
        premiumPlus: true,
      },
      { label: "Highlights tab", info: true, premium: true, premiumPlus: true },
      { label: "Bookmark folders", premium: true, premiumPlus: true },
      { label: "App icons", premium: true, premiumPlus: true },
      { label: "Customize navigation", premium: true, premiumPlus: true },
    ],
  },
];

export const premiumLegalLinks = {
  purchaserTerms: "https://legal.x.com/purchaser-terms.html",
  cancel:
    "https://help.x.com/en/managing-your-account/how-to-cancel-x-premium-subscription",
};

export const premiumUnavailableMessage =
  "Subscriptions aren’t available in this clone.";
