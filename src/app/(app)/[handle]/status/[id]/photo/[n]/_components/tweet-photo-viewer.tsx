import { notFound, redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { MediaViewer } from "@/components/media-viewer/media-viewer";
import { TweetActions } from "@/components/tweet/tweet-actions";
import { getSession } from "@/features/auth/api/get-session";
import { ReplyComposer } from "@/features/compose/components/reply-composer";
import { getProfile } from "@/features/profile/api/get-profile";
import { toggleFollow } from "@/features/profile/api/toggle-follow";
import { getConversation } from "@/features/tweet/api/get-conversation";
import { getReplies } from "@/features/tweet/api/get-replies";
import { toggleBookmark } from "@/features/tweet/api/toggle-bookmark";
import { toggleLike } from "@/features/tweet/api/toggle-like";
import { toggleRetweet } from "@/features/tweet/api/toggle-retweet";
import { FocalTweet } from "@/features/tweet/components/focal-tweet";
import { RepliesSection } from "@/features/tweet/components/replies-section";

const tweetActions = { toggleLike, toggleRetweet, toggleBookmark };

type TweetPhotoViewerProps = {
  params: PageProps<"/[handle]/status/[id]/photo/[n]">["params"];
  intercepted: boolean;
};

export async function TweetPhotoViewer({
  params,
  intercepted,
}: TweetPhotoViewerProps) {
  const { handle, id, n } = await params;
  const [conversation, replies, session] = await Promise.all([
    getConversation(id),
    getReplies(id, null, 100),
    getSession(),
  ]);

  const tweet = conversation?.tweet;
  const index = Number(n) - 1;
  if (!tweet || !session || !tweet.media[index]) {
    if (intercepted) return null;
    notFound();
  }

  const { author } = tweet;
  if (!intercepted && author.handle.toLowerCase() !== handle.toLowerCase()) {
    redirect(routes.tweetPhoto(author.handle, tweet.id, index + 1));
  }

  const profile = await getProfile(author.handle);
  const showFollow = author.id !== session.user.id && !profile?.followedByViewer;

  return (
    <MediaViewer
      label="Image"
      index={index}
      items={tweet.media.map(({ url, alt, width, height }) => ({
        url,
        alt,
        width,
        height,
      }))}
      hrefs={tweet.media.map((_, position) =>
        routes.tweetPhoto(author.handle, tweet.id, position + 1),
      )}
      dismiss={
        intercepted ? "back" : { replace: routes.tweet(author.handle, tweet.id) }
      }
      actions={
        <TweetActions tweet={tweet} actions={tweetActions} variant="viewer" />
      }
      panel={
        <>
          <FocalTweet
            tweet={{ ...tweet, media: [] }}
            actions={tweetActions}
            showFollow={showFollow}
            toggleFollow={toggleFollow}
          />
          <RepliesSection
            replies={replies.items}
            quotesHref={routes.tweetQuotes(author.handle, tweet.id)}
            actions={tweetActions}
            composer={
              <ReplyComposer
                viewer={session.user}
                replyTo={author}
                tweetId={tweet.id}
              />
            }
          />
        </>
      }
    />
  );
}
