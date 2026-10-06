import Link from "next/link";
import type { ReactNode } from "react";
import { routes } from "@/config/routes";
import { parseTweetText } from "@/utils/parse-tweet-text";

type RichTextProps = {
  text: string;
  inert?: boolean;
  linkClassName?: string;
  renderMention?: (handle: string, link: ReactNode) => ReactNode;
};

const entityLink = "relative text-accent hover:underline";

export function hashtagHref(tag: string) {
  return `/hashtag/${encodeURIComponent(tag)}?src=hashtag_click`;
}

export function RichText({
  text,
  inert = false,
  linkClassName = entityLink,
  renderMention,
}: RichTextProps) {
  return parseTweetText(text).map((segment, index) => {
    if (segment.type === "text") return segment.text;
    if (inert) {
      return (
        <span key={index} className="text-accent">
          {segment.text}
        </span>
      );
    }
    if (segment.type === "url") {
      return (
        <a
          key={index}
          href={segment.href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className={linkClassName}
        >
          {segment.text}
        </a>
      );
    }
    if (segment.type === "mention") {
      const link = (
        <Link
          key={index}
          href={routes.profile(segment.handle)}
          className={linkClassName}
        >
          {segment.text}
        </Link>
      );
      return renderMention ? (
        <span key={index}>{renderMention(segment.handle, link)}</span>
      ) : (
        link
      );
    }
    if (segment.type === "hashtag") {
      return (
        <Link
          key={index}
          href={hashtagHref(segment.tag)}
          className={linkClassName}
        >
          {segment.text}
        </Link>
      );
    }
    return (
      <Link
        key={index}
        href={`${routes.search}?q=${encodeURIComponent(segment.text)}&src=cashtag_click`}
        className={linkClassName}
      >
        {segment.text}
      </Link>
    );
  });
}
