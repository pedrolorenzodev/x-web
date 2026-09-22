import { getTimeline } from "@/features/feed/api/get-timeline";

export default async function HomePage() {
  const timeline = await getTimeline();

  return (
    <ul>
      {timeline.items.map(({ tweet, retweetedBy }) => (
        <li key={tweet.id}>
          {retweetedBy ? `${retweetedBy.displayName} reposted — ` : ""}
          {tweet.author.displayName} (@{tweet.author.handle}): {tweet.text}
        </li>
      ))}
    </ul>
  );
}
