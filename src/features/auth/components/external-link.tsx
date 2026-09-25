import type { ReactNode } from "react";

type ExternalLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

export function ExternalLink({ href, className, children }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={className}
    >
      {children}
    </a>
  );
}
