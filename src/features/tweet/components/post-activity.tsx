import type { ReactNode } from "react";
import { routes } from "@/config/routes";
import { PageHeader } from "@/components/layout/page-header";
import { Tab } from "@/components/ui/tab";

type ActivityTab = "quotes" | "retweets" | "likes";

type PostActivityProps = {
  handle: string;
  tweetId: string;
  active: ActivityTab;
  showLikes: boolean;
  children: ReactNode;
};

export function PostActivity({
  handle,
  tweetId,
  active,
  showLikes,
  children,
}: PostActivityProps) {
  return (
    <>
      <PageHeader title="Post activity">
        <nav role="tablist" className="flex border-b border-border">
          <Tab
            label="Quotes"
            href={routes.tweetQuotes(handle, tweetId)}
            active={active === "quotes"}
          />
          <Tab
            label="Reposts"
            href={routes.tweetRetweets(handle, tweetId)}
            active={active === "retweets"}
          />
          {showLikes ? (
            <Tab
              label="Likes"
              href={routes.tweetLikes(handle, tweetId)}
              active={active === "likes"}
            />
          ) : null}
        </nav>
      </PageHeader>
      {children}
    </>
  );
}
