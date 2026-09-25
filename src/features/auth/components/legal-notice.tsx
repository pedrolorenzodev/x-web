import { cn } from "@/lib/utils";
import { legalLinks } from "@/config/links";
import { ExternalLink } from "@/features/auth/components/external-link";

const link = "font-medium whitespace-nowrap text-white";

type LegalNoticeProps = {
  className?: string;
};

export function LegalNotice({ className }: LegalNoticeProps) {
  return (
    <p
      className={cn(
        "-mx-3 text-center text-[12px] leading-[18px] font-normal text-auth-legal",
        className,
      )}
    >
      By continuing, you agree to our{" "}
      <ExternalLink href={legalLinks.termsOfService} className={link}>
        Terms of Service
      </ExternalLink>
      ,{" "}
      <ExternalLink href={legalLinks.privacyPolicy} className={link}>
        Privacy Policy
      </ExternalLink>{" "}
      and{" "}
      <ExternalLink href={legalLinks.cookieUse} className={link}>
        Cookie Use
      </ExternalLink>
      .
    </p>
  );
}
