import Link from "next/link";
import { routes } from "@/config/routes";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

export type ProfileEmptyKind =
  | "posts"
  | "replies"
  | "reposts"
  | "videos"
  | "photos"
  | "highlights";

type Copy = { title: string; body: string };

const ownCopy: Record<ProfileEmptyKind, Copy> = {
  posts: {
    title: "You haven’t posted yet",
    body: "When you post, your posts will show up here.",
  },
  replies: {
    title: "You haven’t replied yet",
    body: "When you reply, your replies will show up here.",
  },
  reposts: {
    title: "You haven’t reposted yet",
    body: "When you repost, your reposts will show up here.",
  },
  videos: {
    title: "You haven’t posted videos yet",
    body: "When you post videos, they will show up here.",
  },
  photos: {
    title: "You haven’t posted photos yet",
    body: "When you post photos, they will show up here.",
  },
  highlights: {
    title: "Highlight on your profile",
    body: "You must be subscribed to Premium to highlight posts on your profile.",
  },
};

function otherCopy(kind: ProfileEmptyKind, handle: string): Copy {
  const subject = `@${handle}`;
  switch (kind) {
    case "posts":
      return {
        title: `${subject} hasn’t posted`,
        body: "When they do, their posts will show up here.",
      };
    case "replies":
      return {
        title: `${subject} hasn’t replied yet`,
        body: "When they do, their replies will show up here.",
      };
    case "reposts":
      return {
        title: `${subject} hasn’t reposted yet`,
        body: "When they do, their reposts will show up here.",
      };
    case "videos":
      return {
        title: `${subject} hasn’t posted videos`,
        body: "When they do, their videos will show up here.",
      };
    case "photos":
      return {
        title: `${subject} hasn’t posted photos`,
        body: "When they do, their photos will show up here.",
      };
    case "highlights":
      return {
        title: `${subject} hasn’t highlighted any posts`,
        body: "When they do, those posts will show up here.",
      };
  }
}

type ProfileEmptyStateProps = {
  kind: ProfileEmptyKind;
  handle: string;
  isViewer: boolean;
};

export function ProfileEmptyState({
  kind,
  handle,
  isViewer,
}: ProfileEmptyStateProps) {
  const copy = isViewer ? ownCopy[kind] : otherCopy(kind, handle);

  return (
    <EmptyState
      title={copy.title}
      body={copy.body}
      className="max-w-[416px] px-10"
      action={
        isViewer && kind === "highlights" ? (
          <Link
            href={routes.premium}
            className={cn(buttonStyles({ size: "lg" }), "h-13 px-8 text-[17px]")}
          >
            Subscribe to Premium
          </Link>
        ) : null
      }
    />
  );
}

export function ProtectedPostsState({ handle }: { handle: string }) {
  return (
    <EmptyState
      title="These posts are protected"
      body={
        <>
          Only approved followers can see @{handle}’s posts. To request access,
          click Follow.{" "}
          <a
            href="https://help.x.com/en/safety-and-security/public-and-protected-posts"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Learn more
          </a>
        </>
      }
      className="mt-[87px] max-w-[440px] px-10"
    />
  );
}
