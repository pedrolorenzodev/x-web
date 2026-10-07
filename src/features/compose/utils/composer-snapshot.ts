import type { Draft } from "@/types/draft";
import type { NewPollInput, NewPost, TweetMedia } from "@/types/tweet";
import type {
  ComposerMedia,
  ComposerPoll,
  ComposerPost,
  ComposerSnapshot,
} from "@/features/compose/types/composer";

const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;

let localSequence = 0;

export function createLocalId(prefix: string) {
  localSequence += 1;
  return `${prefix}${localSequence}`;
}

export function createEmptyPost(): ComposerPost {
  return { id: createLocalId("post"), text: "", media: [], poll: null };
}

export function createEmptySnapshot(): ComposerSnapshot {
  return {
    posts: [createEmptyPost()],
    activeIndex: 0,
    replySettings: "everyone",
    scheduledAt: null,
    disclosure: { paidPartnership: false, madeWithAi: false },
    draftId: null,
  };
}

export function createEmptyPoll(): ComposerPoll {
  return { choices: ["", ""], days: 1, hours: 0, minutes: 0 };
}

export function pollDurationMinutes(poll: ComposerPoll) {
  return (
    poll.days * MINUTES_PER_DAY + poll.hours * MINUTES_PER_HOUR + poll.minutes
  );
}

function toPollInput(poll: ComposerPoll): NewPollInput {
  return { choices: poll.choices, durationMinutes: pollDurationMinutes(poll) };
}

function fromPollInput(poll: NewPollInput): ComposerPoll {
  const rest = poll.durationMinutes % MINUTES_PER_DAY;
  return {
    choices: poll.choices,
    days: Math.floor(poll.durationMinutes / MINUTES_PER_DAY),
    hours: Math.floor(rest / MINUTES_PER_HOUR),
    minutes: rest % MINUTES_PER_HOUR,
  };
}

function toTweetMedia(media: ComposerMedia): TweetMedia {
  const { url, width, height, alt } = media;
  if (media.kind === "gif") {
    return {
      type: "video",
      url,
      width,
      height,
      alt,
      videoUrl: media.videoUrl,
      isGif: true,
    };
  }
  return { type: "photo", url, width, height, alt };
}

function fromTweetMedia(media: TweetMedia): ComposerMedia {
  return {
    id: createLocalId("media"),
    kind: media.isGif ? "gif" : "photo",
    url: media.url,
    videoUrl: media.videoUrl,
    width: media.width,
    height: media.height,
    alt: media.alt,
  };
}

export function toNewPosts(posts: ComposerPost[]): NewPost[] {
  return posts.map((post) => ({
    text: post.text,
    media: post.media.map(toTweetMedia),
    poll: post.poll ? toPollInput(post.poll) : null,
  }));
}

export function snapshotFromDraft(draft: Draft): ComposerSnapshot {
  const posts = draft.posts.map((post) => ({
    id: createLocalId("post"),
    text: post.text,
    media: post.media.map(fromTweetMedia),
    poll: post.poll ? fromPollInput(post.poll) : null,
  }));
  return {
    ...createEmptySnapshot(),
    posts: posts.length > 0 ? posts : [createEmptyPost()],
    activeIndex: Math.max(posts.length - 1, 0),
    replySettings: draft.replySettings,
    scheduledAt: draft.scheduledAt,
    draftId: draft.id,
  };
}

export function isPostEmpty(post: ComposerPost) {
  return post.text.trim() === "" && post.media.length === 0 && !post.poll;
}
