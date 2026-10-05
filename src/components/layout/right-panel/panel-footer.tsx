import { FooterMoreMenu } from "@/components/layout/right-panel/footer-more-menu";

const links = [
  { label: "Terms", href: "https://x.com/tos" },
  { label: "Privacy", href: "https://x.com/privacy" },
  { label: "Cookies", href: "https://support.x.com/articles/20170514" },
  { label: "Accessibility", href: "https://help.x.com/resources/accessibility" },
  {
    label: "Ads Info",
    href: "https://business.x.com/help/troubleshooting/how-twitter-ads-work.html",
  },
];

const footerItem = "my-0.5 flex h-5 items-center pr-3";
const footerLabel = "text-[11px] leading-3 text-muted";

export function PanelFooter() {
  return (
    <nav aria-label="Footer" className="mb-4 flex flex-wrap px-4">
      {links.map((link) => (
        <span key={link.label} className={footerItem}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${footerLabel} hover:underline`}
          >
            {link.label}
          </a>
          <span aria-hidden className="text-base text-muted">
            &nbsp;·
          </span>
        </span>
      ))}
      <FooterMoreMenu />
      <span className={`${footerItem} ${footerLabel}`}>© 2026 X Corp.</span>
    </nav>
  );
}
