import { landingFooterLinks, type FooterLink } from "@/config/links";
import { ExternalLink } from "@/features/auth/components/external-link";

function FooterItem({ link }: { link: FooterLink }) {
  return (
    <span className="flex items-center">
      {link.narrowHref ? (
        <>
          <ExternalLink
            href={link.href}
            className="hidden hover:underline min-[1001px]:inline"
          >
            {link.label}
          </ExternalLink>
          <ExternalLink
            href={link.narrowHref}
            className="inline hover:underline min-[1001px]:hidden"
          >
            {link.label}
          </ExternalLink>
        </>
      ) : (
        <ExternalLink href={link.href} className="hover:underline">
          {link.label}
        </ExternalLink>
      )}
      <span aria-hidden className="px-1 text-auth-dot select-none">
        ·
      </span>
    </span>
  );
}

export function LandingFooter() {
  return (
    <footer>
      <nav className="flex flex-wrap items-center justify-center gap-y-1 px-4 py-3 text-[11px] leading-6 font-normal text-auth-muted">
        {landingFooterLinks.map((link) => (
          <FooterItem key={link.href} link={link} />
        ))}
        <span className="select-none">© 2026 X Corp.</span>
      </nav>
    </footer>
  );
}
