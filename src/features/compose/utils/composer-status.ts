import { MAX_TWEET_LENGTH } from "@/config/tweet";
import { MIN_POLL_CHOICES } from "@/config/compose";
import type {
  ComposerPoll,
  ComposerPost,
  ComposerSnapshot,
} from "@/features/compose/types/composer";
import {
  isPostEmpty,
  pollDurationMinutes,
} from "@/features/compose/utils/composer-snapshot";

export function countCharacters(text: string) {
  return [...text].length;
}

function isPollReady(poll: ComposerPoll | null) {
  if (!poll) return true;
  const filled = poll.choices.filter((choice) => choice.trim()).length;
  return filled >= MIN_POLL_CHOICES && pollDurationMinutes(poll) > 0;
}

export function isPostReady(post: ComposerPost, allowEmpty: boolean) {
  if (countCharacters(post.text) > MAX_TWEET_LENGTH) return false;
  if (!isPollReady(post.poll)) return false;
  if (post.poll && post.text.trim() === "") return false;
  return allowEmpty || post.text.trim() !== "" || post.media.length > 0;
}

export function canPublish(snapshot: ComposerSnapshot, allowEmptyFirst: boolean) {
  return snapshot.posts.every((post, index) =>
    isPostReady(post, allowEmptyFirst && index === 0),
  );
}

export function hasContent(snapshot: ComposerSnapshot) {
  return snapshot.posts.some((post) => !isPostEmpty(post));
}
