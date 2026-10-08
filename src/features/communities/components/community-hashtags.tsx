import Link from "next/link";
import { routes } from "@/config/routes";

export function CommunityHashtags({
  communityId,
  hashtags,
}: {
  communityId: string;
  hashtags: string[];
}) {
  if (hashtags.length === 0) return null;

  return (
    <div className="flex overflow-x-auto border-b border-border px-2 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {hashtags.map((tag) => (
        <Link
          key={tag}
          href={routes.communityHashtag(communityId, tag)}
          className="shrink-0 px-2 text-base font-medium whitespace-nowrap text-accent hover:underline"
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}
