import type { TweetActions } from "@/types/tweet";
import { BackButton } from "@/components/layout/back-button";
import { Tab } from "@/components/ui/tab";
import { TweetCard } from "@/components/tweet/tweet-card";
import { formatNewsTime } from "@/utils/format-news-time";
import type { NewsStoryDetail } from "@/features/explore/api/get-news-story";
import { NewsStoryActions } from "@/features/explore/components/news-story-actions";

export type NewsStoryTimeline = "top" | "latest";

type NewsStoryViewProps = {
  detail: NewsStoryDetail;
  timeline: NewsStoryTimeline;
  path: string;
  actions: TweetActions;
};

export function NewsStoryView({
  detail,
  timeline,
  path,
  actions,
}: NewsStoryViewProps) {
  const { story } = detail;
  const tweets = timeline === "latest" ? detail.latest : detail.top;

  return (
    <div className="min-h-dvh pb-16">
      <div className="sticky top-0 z-3 bg-background/65 backdrop-blur-[12px]">
        <div className="flex h-[53px] items-center justify-between px-4">
          <BackButton />
          <NewsStoryActions path={path} />
        </div>
      </div>

      <article className="px-4 pb-3">
        <h1 className="text-[23px] leading-7 font-extrabold">{story.headline}</h1>
        <p className="mt-1 text-xs text-muted" suppressHydrationWarning>
          Last updated {formatNewsTime(story.publishedAt, false)}
        </p>
        <p className="mt-2 text-base">{story.summary}</p>
        <p className="mt-4 text-xs text-muted">
          This story is a summary of posts on X and may evolve over time. Grok
          can make mistakes, verify its outputs.
        </p>
      </article>

      <div role="tablist" className="flex border-y border-border">
        <Tab label="Top" href={path} active={timeline === "top"} />
        <Tab
          label="Latest"
          href={`${path}?timeline=latest`}
          active={timeline === "latest"}
        />
      </div>

      {tweets.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} actions={actions} showReplyingTo />
      ))}
    </div>
  );
}
