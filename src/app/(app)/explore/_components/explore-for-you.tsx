import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { NewsRow } from "@/components/explore/news-row";
import { TrendList } from "@/components/explore/trend-list";
import { ModuleDivider, ModuleHeader, ShowMoreRow } from "@/components/ui/module";
import { UserCell } from "@/components/user/user-cell";
import { getSession } from "@/features/auth/api/get-session";
import { getNews } from "@/features/explore/api/get-news";
import { getTrends } from "@/features/explore/api/get-trends";
import { getTimeline } from "@/features/feed/api/get-timeline";
import { TimelineFeed } from "@/features/feed/components/timeline-feed";
import { getSuggestedUsers } from "@/features/profile/api/get-suggested-users";
import { toggleFollow } from "@/features/profile/api/toggle-follow";
import { toggleBookmark } from "@/features/tweet/api/toggle-bookmark";
import { toggleLike } from "@/features/tweet/api/toggle-like";
import { toggleRetweet } from "@/features/tweet/api/toggle-retweet";

const tweetActions = { toggleLike, toggleRetweet, toggleBookmark };

export async function ExploreForYou() {
  const [session, news, trends, people, posts] = await Promise.all([
    getSession(),
    getNews(null, null, 3),
    getTrends(null, 6),
    getSuggestedUsers(3),
    getTimeline("for-you"),
  ]);
  if (!session) redirect(routes.expiredSession);

  return (
    <>
      <ModuleHeader>Today&apos;s News</ModuleHeader>
      {news.items.map((story) => (
        <NewsRow key={story.id} story={story} />
      ))}
      <ModuleDivider />
      <TrendList trends={trends.items} />
      <ModuleDivider />
      <ModuleHeader>Who to follow</ModuleHeader>
      {people.map((user) => (
        <UserCell
          key={user.id}
          user={user}
          viewerId={session.user.id}
          toggleFollow={toggleFollow}
        />
      ))}
      <ShowMoreRow href={routes.connectPeople} />
      <ModuleDivider />
      <ModuleHeader>Posts For You</ModuleHeader>
      <TimelineFeed kind="for-you" firstPage={posts} actions={tweetActions} />
    </>
  );
}
