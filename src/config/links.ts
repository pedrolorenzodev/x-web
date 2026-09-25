export const legalLinks = {
  termsOfService: "https://x.com/tos",
  privacyPolicy: "https://x.com/privacy",
  cookieUse: "https://help.x.com/rules-and-policies/twitter-cookies",
} as const;

export type FooterLink = {
  label: string;
  href: string;
  narrowHref?: string;
};

export const landingFooterLinks: FooterLink[] = [
  { label: "About", href: "https://about.x.com" },
  { label: "Get App", href: "https://help.x.com/using-x/download-the-x-app" },
  {
    label: "Grok",
    href: "https://grok.com/",
    narrowHref: "https://grok.com/download",
  },
  { label: "Help", href: "https://help.x.com" },
  { label: "Terms", href: legalLinks.termsOfService },
  { label: "Privacy", href: legalLinks.privacyPolicy },
  { label: "Cookies", href: "https://support.x.com/articles/20170514" },
  { label: "Careers", href: "https://careers.x.com" },
  {
    label: "Ads & Business",
    href: "https://business.x.com/advertising?ref=gl-tw-tw-twitter-advertise",
  },
  { label: "Developers", href: "https://developer.x.com" },
  { label: "News", href: "https://x.com/i/jf/stories/home" },
  { label: "Accessibility", href: "https://help.x.com/resources/accessibility" },
];
