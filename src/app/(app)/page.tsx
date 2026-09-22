import { TimelineHeader } from "@/features/feed/components/timeline-header";
import { getTimeline } from "@/features/feed/api/get-timeline";

export default async function HomePage() {
  const timeline = await getTimeline();

  return (
    <>
      <TimelineHeader />
      <ul>
        {timeline.items.map(({ tweet, retweetedBy }) => (
          <li key={tweet.id} className="border-b border-border px-4 py-8">
            {retweetedBy ? `${retweetedBy.displayName} reposted — ` : ""}
            {tweet.author.displayName} (@{tweet.author.handle}): {tweet.text}
          </li>
        ))}
      </ul>
    </>
  );
}
