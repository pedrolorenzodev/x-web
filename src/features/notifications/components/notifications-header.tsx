"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { routes } from "@/config/routes";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsIcon } from "@/components/ui/icons";
import { Tab } from "@/components/ui/tab";

export function NotificationsHeader() {
  const segment = useSelectedLayoutSegment();

  return (
    <PageHeader
      title="Notifications"
      back={false}
      action={
        <Link
          href={routes.notificationsSettings}
          aria-label="Settings"
          data-testid="settingsAppBar"
          className="-mr-[9px] flex size-9 items-center justify-center rounded-full transition-colors duration-200 ease-[ease] hover:bg-foreground/10"
        >
          <SettingsIcon className="size-5" />
        </Link>
      }
    >
      <div role="tablist" className="flex border-b border-border">
        <Tab
          label="All"
          href={routes.notifications}
          active={segment !== "mentions"}
        />
        <Tab
          label="Mentions"
          href={routes.notificationsMentions}
          active={segment === "mentions"}
        />
      </div>
    </PageHeader>
  );
}
