import { routes } from "@/config/routes";
import { landingFooterLinks } from "@/config/links";
import {
  AccessibilityIcon,
  AdsIcon,
  AppsAndSessionsIcon,
  BrokenHeartIcon,
  ChatBubbleIcon,
  ConnectedAccountsIcon,
  ContentPreferencesIcon,
  DelegateIcon,
  DiscoverabilityIcon,
  DisplayIcon,
  DownloadIcon,
  FiltersIcon,
  GrokIcon,
  GroupIcon,
  InferredIdentityIcon,
  KeyIcon,
  KeyboardShortcutsIcon,
  LanguagesIcon,
  LocationIcon,
  MuteIcon,
  NotificationPreferencesIcon,
  ProfileIcon,
  QuotePencilIcon,
  SecurityIcon,
  SpacesIcon,
  ViewsIcon,
} from "@/components/ui/icons";
import type {
  SettingsCategory,
  SettingsLink,
  SettingsNavItem,
} from "@/features/settings/types/settings";

const footerHref = (label: string) =>
  landingFooterLinks.find((link) => link.label === label)?.href ?? "https://help.x.com";

const external = (label: string, href: string): SettingsLink => ({
  label,
  href,
  external: true,
});

export const settingsCategories: SettingsCategory[] = [
  {
    id: "account",
    label: "Your account",
    title: "Your Account",
    href: "/settings/account",
    description:
      "See information about your account, download an archive of your data, or learn about your account deactivation options",
    sections: [
      {
        links: [
          {
            label: "Account information",
            description:
              "See your account information like your phone number and email address.",
            href: "/settings/your_twitter_data/account",
            icon: ProfileIcon,
          },
          {
            label: "Change your password",
            description: "Change your password at any time.",
            href: "/settings/password",
            icon: KeyIcon,
          },
          {
            label: "Download an archive of your data",
            description:
              "Get insights into the type of information stored for your account.",
            href: "/settings/download_your_data",
            icon: DownloadIcon,
          },
          {
            label: "Deactivate your account",
            description: "Find out how you can deactivate your account.",
            href: "/settings/deactivate",
            icon: BrokenHeartIcon,
          },
        ],
      },
    ],
  },
  {
    id: "security_and_account_access",
    label: "Security and account access",
    title: "Security and account access",
    href: "/settings/security_and_account_access",
    description:
      "Manage your account’s security and keep track of your account’s usage including apps that you have connected to your account.",
    sections: [
      {
        links: [
          {
            label: "Security",
            description: "Manage your account’s security.",
            href: "/settings/security",
            icon: SecurityIcon,
          },
          {
            label: "Apps and sessions",
            description:
              "See information about when you logged into your account and the apps you connected to your account.",
            href: "/settings/apps_and_sessions",
            icon: AppsAndSessionsIcon,
          },
          {
            label: "Connected accounts",
            description:
              "Manage Google or Apple accounts connected to X to log in.",
            href: "/settings/connected_accounts",
            icon: ConnectedAccountsIcon,
          },
          {
            label: "Delegate",
            description: "Manage your shared accounts.",
            href: "/settings/delegate",
            icon: DelegateIcon,
          },
        ],
      },
    ],
  },
  {
    id: "privacy_and_safety",
    label: "Privacy and safety",
    title: "Privacy and safety",
    href: "/settings/privacy_and_safety",
    description: "Manage what information you see and share on X.",
    sections: [
      {
        heading: "Your X activity",
        links: [
          {
            label: "Audience, media and tagging",
            description:
              "Manage what information you allow other people on X to see.",
            href: "/settings/audience_and_tagging",
            icon: GroupIcon,
          },
          {
            label: "Your posts",
            description: "Manage the information associated with your posts.",
            href: "/settings/your_tweets",
            icon: QuotePencilIcon,
          },
          {
            label: "Content you see",
            description:
              "Decide what you see on X based on your preferences like interests",
            href: "/settings/content_you_see",
            icon: ContentPreferencesIcon,
          },
          {
            label: "Mute and block",
            description:
              "Manage the accounts, words, and notifications that you’ve muted or blocked.",
            href: "/settings/mute_and_block",
            icon: MuteIcon,
          },
          {
            label: "Chat",
            description: "Manage who can message you directly.",
            href: "/settings/direct_messages",
            icon: ChatBubbleIcon,
          },
          {
            label: "Spaces",
            description: "Manage who can see your Spaces listening activity",
            href: "/settings/spaces",
            icon: SpacesIcon,
          },
          {
            label: "Discoverability and contacts",
            description:
              "Control your discoverability settings and manage contacts you’ve imported.",
            href: "/settings/contacts",
            icon: DiscoverabilityIcon,
          },
          {
            label: "About your account",
            description: "Manage the location associated with your account",
            href: "/settings/about_your_account",
            icon: LanguagesIcon,
          },
        ],
      },
      {
        heading: "Data sharing and personalization",
        links: [
          {
            label: "Ads preferences",
            description: "Manage your ads experience on X.",
            href: "/settings/ads_preferences",
            icon: AdsIcon,
          },
          {
            label: "Inferred identity",
            description:
              "Allow X to personalize your experience with your inferred activity, e.g. activity on devices you haven’t used to log in to X.",
            href: "/settings/off_twitter_activity",
            icon: InferredIdentityIcon,
          },
          {
            label: "Data sharing with business partners",
            description:
              "Allow sharing of additional information with X’s business partners.",
            href: "/settings/data_sharing_with_business_partners",
            icon: ConnectedAccountsIcon,
          },
          {
            label: "Location information",
            description:
              "Manage the location information X uses to personalize your experience.",
            href: "/settings/location_information",
            icon: LocationIcon,
          },
          {
            label: "Grok & Third-party Collaborators",
            description:
              "Allow your public data as well as your interactions, inputs, and results with Grok and xAI to be used for training and fine-tuning",
            href: "/settings/grok_settings",
            icon: GrokIcon,
          },
        ],
      },
      {
        heading: "Learn more about privacy on X",
        links: [
          external("Privacy center", "https://privacy.x.com/"),
          external("Privacy policy", "https://x.com/en/privacy"),
          external("Contact us", "https://help.x.com/forms/privacy"),
        ],
      },
    ],
  },
  {
    id: "notifications",
    label: "Notifications",
    title: "Notifications",
    href: routes.notificationsSettings,
    description:
      "Select the kinds of notifications you get about your activities, interests, and recommendations.",
    sections: [
      {
        links: [
          {
            label: "Filters",
            description:
              "Choose the notifications you’d like to see — and those you don’t.",
            href: "/settings/notifications/filters",
            icon: FiltersIcon,
          },
          {
            label: "Preferences",
            description: "Select your preferences by notification type.",
            href: "/settings/notifications/preferences",
            icon: NotificationPreferencesIcon,
          },
        ],
      },
    ],
  },
  {
    id: "accessibility_display_and_languages",
    label: "Accessibility, display, and languages",
    title: "Accessibility, display, and languages",
    href: "/settings/accessibility_display_and_languages",
    description: "Manage how X content is displayed to you.",
    sections: [
      {
        links: [
          {
            label: "Accessibility",
            description:
              "Manage aspects of your X experience such as limiting color contrast and motion.",
            href: "/settings/accessibility",
            icon: AccessibilityIcon,
          },
          {
            label: "Display",
            description:
              "Manage your font size, color, and background. These settings affect all the X accounts on this browser.",
            href: "/settings/display",
            icon: DisplayIcon,
          },
          {
            label: "Languages",
            description:
              "Manage which languages are used to personalize your X experience.",
            href: "/settings/languages",
            icon: LanguagesIcon,
          },
          {
            label: "Data usage",
            description:
              "Limit how X uses some of your network data on this device.",
            href: "/settings/data",
            icon: ViewsIcon,
          },
          {
            label: "Keyboard shortcuts",
            href: "/i/keyboard_shortcuts",
            icon: KeyboardShortcutsIcon,
          },
        ],
      },
    ],
  },
  {
    id: "about",
    label: "Additional resources",
    title: "Additional resources",
    href: "/settings/about",
    description:
      "Check out other places for helpful information to learn more about X products and services.",
    sections: [
      {
        heading: "Release notes",
        links: [external("Release notes", "https://x.com/i/release_notes")],
      },
      {
        heading: "Legal",
        links: [
          external("Ads & Business", footerHref("Ads & Business")),
          external("Cookies", footerHref("Cookies")),
          external("Privacy", footerHref("Privacy")),
          external("Terms", footerHref("Terms")),
        ],
      },
      {
        heading: "Miscellaneous",
        links: [
          external("About", footerHref("About")),
          external("Accessibility", footerHref("Accessibility")),
          external("Careers", footerHref("Careers")),
          external("Developers", footerHref("Developers")),
          external("Get App", footerHref("Get App")),
          external("Grok", "https://grok.com?referrer=x_footer"),
          external("Help", footerHref("Help")),
          external("Imagine", "https://grok.com/imagine?referrer=x_footer"),
          external("News", footerHref("News")),
        ],
      },
    ],
  },
];

const categoryHref = (id: string) =>
  settingsCategories.find((category) => category.id === id)?.href ?? "";

export const settingsNavItems: SettingsNavItem[] = [
  { label: "Your account", href: categoryHref("account"), categoryId: "account" },
  { label: "Monetization", href: "/settings/monetization" },
  { label: "Premium", href: `${routes.premium}?referring_page=settings` },
  {
    label: "Security and account access",
    href: categoryHref("security_and_account_access"),
    categoryId: "security_and_account_access",
  },
  {
    label: "Privacy and safety",
    href: categoryHref("privacy_and_safety"),
    categoryId: "privacy_and_safety",
  },
  {
    label: "Notifications",
    href: categoryHref("notifications"),
    categoryId: "notifications",
  },
  {
    label: "Accessibility, display, and languages",
    href: categoryHref("accessibility_display_and_languages"),
    categoryId: "accessibility_display_and_languages",
  },
  { label: "Additional resources", href: categoryHref("about"), categoryId: "about" },
  { label: "Help Center", href: "https://support.x.com/", external: true },
];

export const settingsRedirects: Record<string, string> = {
  "/settings/monetization": routes.creatorStudio,
};

export const hiddenSettingsPages: { href: string; title: string; parentId: string }[] = [
  { href: routes.settingsSessions, title: "Sessions", parentId: "security_and_account_access" },
  { href: "/settings/search", title: "Search settings", parentId: "privacy_and_safety" },
  { href: "/settings/explore", title: "Explore settings", parentId: "privacy_and_safety" },
  { href: "/settings/explore/location", title: "Explore locations", parentId: "privacy_and_safety" },
];
