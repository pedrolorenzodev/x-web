import { EmptyState } from "@/components/ui/empty-state";
import type { FollowListKind } from "@/features/profile/types/follow-list";

const PROTECTED_HELP_URL =
  "https://help.x.com/safety-and-security/public-and-protected-posts";

type EmptyCopy = { title: string; body: string };

function ownCopy(kind: FollowListKind): EmptyCopy {
  switch (kind) {
    case "verified_followers":
      return {
        title: "You don’t have any verified followers yet",
        body: "When a verified account follows you, you’ll see them here.",
      };
    case "followers_you_follow":
      return {
        title: "You don’t have any followers yet",
        body: "When someone follows you, you’ll see them here.",
      };
    case "followers":
      return {
        title: "Looking for followers?",
        body: "When someone follows this account, they’ll show up here. Posting and interacting with others helps boost followers.",
      };
    case "following":
      return {
        title: "Be in the know",
        body: "Following accounts is an easy way to curate your timeline and know what’s happening with the topics and people you’re interested in.",
      };
  }
}

function otherCopy(kind: FollowListKind, handle: string): EmptyCopy {
  switch (kind) {
    case "verified_followers":
      return {
        title: `@${handle} doesn’t have any verified followers.`,
        body: "When someone verified follows this account, they’ll show up here.",
      };
    case "followers_you_follow":
      return {
        title: `@${handle} doesn’t have any followers you know yet`,
        body: "When someone you know follows them, they’ll be listed here.",
      };
    case "followers":
      return {
        title: `@${handle} doesn’t have any followers`,
        body: "When someone follows them, they’ll be listed here.",
      };
    case "following":
      return {
        title: `@${handle} isn’t following anyone`,
        body: "Once they follow accounts, they’ll show up here.",
      };
  }
}

type FollowListEmptyProps = {
  kind: FollowListKind;
  handle: string;
  isViewer: boolean;
};

export function FollowListEmpty({ kind, handle, isViewer }: FollowListEmptyProps) {
  const copy = isViewer ? ownCopy(kind) : otherCopy(kind, handle);

  return <EmptyState title={copy.title} body={copy.body} />;
}

export function FollowListProtected({ handle }: { handle: string }) {
  return (
    <EmptyState
      title="These posts are protected"
      body={
        <>
          Only approved followers can see @{handle}’s posts. To request access,
          click Follow.{" "}
          <a
            href={PROTECTED_HELP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Learn more
          </a>
        </>
      }
    />
  );
}
