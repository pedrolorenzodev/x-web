import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ModuleHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn("px-4 py-3 text-xl font-extrabold", className)}>
      {children}
    </h2>
  );
}

export function ShowMoreRow({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="flex h-13 items-center px-4 text-base text-accent transition-colors duration-200 ease-[ease] hover:bg-white/3"
    >
      Show more
    </Link>
  );
}

export function ModuleDivider() {
  return <div aria-hidden className="h-px bg-border" />;
}
