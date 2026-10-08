import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SpinnerRow } from "@/components/ui/spinner";
import { newsStoryHref } from "@/components/explore/news-row";
import { getNewsStory } from "@/features/explore/api/get-news-story";
import { NewsStoryView } from "@/features/explore/components/news-story-view";
import { toggleBookmark } from "@/features/tweet/api/toggle-bookmark";
import { toggleLike } from "@/features/tweet/api/toggle-like";
import { toggleRetweet } from "@/features/tweet/api/toggle-retweet";

const tweetActions = { toggleLike, toggleRetweet, toggleBookmark };

export async function generateMetadata({
  params,
}: PageProps<"/i/trending/[id]">): Promise<Metadata> {
  const detail = await getNewsStory((await params).id);
  return { title: detail ? `${detail.story.headline} / X` : "Page not found / X" };
}

async function NewsStory({ params, searchParams }: PageProps<"/i/trending/[id]">) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const detail = await getNewsStory(id);
  if (!detail) notFound();

  return (
    <NewsStoryView
      detail={detail}
      timeline={query.timeline === "latest" ? "latest" : "top"}
      path={newsStoryHref(id)}
      actions={tweetActions}
    />
  );
}

export default function NewsStoryPage(props: PageProps<"/i/trending/[id]">) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <NewsStory {...props} />
    </Suspense>
  );
}
