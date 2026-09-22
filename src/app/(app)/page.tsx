import { notFound } from "next/navigation";
import { TimelineHeader } from "@/features/feed/components/timeline-header";
import { Composer } from "@/features/compose/components/composer";
import { getSession } from "@/features/auth/api/get-session";
import { getTimeline } from "@/features/feed/api/get-timeline";

export default async function HomePage() {
  const session = await getSession();
  if (!session) notFound();

  const timeline = await getTimeline();

  return (
    <>
      <TimelineHeader />
      <Composer viewer={session.user} />
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
