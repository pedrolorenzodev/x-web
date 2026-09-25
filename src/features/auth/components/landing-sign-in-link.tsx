"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { routes } from "@/config/routes";
import { useLandingOnboarding } from "@/features/auth/components/landing-onboarding";

export function LandingSignInLink() {
  const { open } = useLandingOnboarding();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    open("login", { start: "default" });
  }

  return (
    <Link
      href={routes.login}
      prefetch={false}
      onClick={handleClick}
      className="flex h-11 w-full max-w-[400px] items-center justify-center rounded-full border border-auth-outline px-4 text-[15px] leading-5 font-bold text-white transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-auth-outline-hover"
    >
      Sign in
    </Link>
  );
}
