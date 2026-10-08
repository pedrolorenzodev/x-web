import Link from "next/link";
import type { Tweet } from "@/types/tweet";
import { routes } from "@/config/routes";
import { GrokIcon } from "@/components/ui/icons";
import { Tooltip } from "@/components/ui/tooltip";

export function canExplain(tweet: Tweet) {
  return (
    tweet.media.length > 0 ||
    Boolean(tweet.card || tweet.quotedTweet || tweet.poll)
  );
}

export function GrokButton() {
  return (
    <Tooltip label="Explain this post">
      <Link
        href={routes.grok}
        aria-label="Grok actions"
        className="group/grok relative flex h-5 items-center text-muted transition-colors duration-200 ease-[ease] hover:text-accent"
      >
        <span className="absolute -inset-2 rounded-full transition-colors duration-200 ease-[ease] group-hover/grok:bg-accent/10" />
        <GrokIcon className="relative h-5 w-[19.33px]" />
      </Link>
    </Tooltip>
  );
}
