"use client";

import { useLayoutEffect, useState, type ReactNode } from "react";
import { routes } from "@/config/routes";
import { Tab } from "@/components/ui/tab";
import { TabBar } from "@/components/ui/tab-bar";

export type CommunityFeedTab = "top" | "latest" | "media";

const feedTabs: { id: CommunityFeedTab; label: string }[] = [
  { id: "top", label: "Top" },
  { id: "latest", label: "Latest" },
  { id: "media", label: "Media" },
];

type CommunityTabsProps = {
  communityId: string;
  initialTab: CommunityFeedTab | "about";
  panels?: Record<CommunityFeedTab, ReactNode>;
  children?: ReactNode;
};

export function CommunityTabs({
  communityId,
  initialTab,
  panels,
  children,
}: CommunityTabsProps) {
  const [tab, setTab] = useState(initialTab);
  const onAbout = !panels;

  useLayoutEffect(() => () => setTab(initialTab), [initialTab]);

  return (
    <>
      <TabBar label="Community tabs">
        {feedTabs.map((item) => (
          <Tab
            key={item.id}
            label={item.label}
            active={!onAbout && tab === item.id}
            href={
              onAbout
                ? item.id === "top"
                  ? routes.community(communityId)
                  : `${routes.community(communityId)}?tab=${item.id}`
                : undefined
            }
            onClick={onAbout ? undefined : () => setTab(item.id)}
          />
        ))}
        <Tab
          label="About"
          active={onAbout}
          href={routes.communityAbout(communityId)}
        />
      </TabBar>
      {panels && tab !== "about" ? panels[tab] : children}
    </>
  );
}
