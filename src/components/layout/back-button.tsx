"use client";

import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { IconButton } from "@/components/ui/icon-button";
import { BackIcon } from "@/components/ui/icons";

export function BackButton() {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push(routes.home);
  }

  return (
    <IconButton
      label="Back"
      tone="plain"
      onClick={goBack}
      className="-ml-2 size-9"
    >
      <BackIcon className="size-5" />
    </IconButton>
  );
}
