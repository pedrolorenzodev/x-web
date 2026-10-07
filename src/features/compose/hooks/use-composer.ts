import { useState } from "react";
import type { ReplySettings } from "@/types/tweet";
import { MAX_MEDIA_PER_POST } from "@/config/compose";
import type {
  ComposerMedia,
  ComposerPoll,
  ComposerPost,
  ComposerSnapshot,
  ContentDisclosure,
} from "@/features/compose/types/composer";
import {
  createEmptyPost,
  createEmptySnapshot,
} from "@/features/compose/utils/composer-snapshot";

export type Composer = ReturnType<typeof useComposer>;

export function useComposer(initial: () => ComposerSnapshot) {
  const [snapshot, setSnapshot] = useState(initial);
  const activePost = snapshot.posts[snapshot.activeIndex];

  function updatePost(
    index: number,
    change: (post: ComposerPost) => Partial<ComposerPost>,
  ) {
    setSnapshot((current) => ({
      ...current,
      posts: current.posts.map((post, position) =>
        position === index ? { ...post, ...change(post) } : post,
      ),
    }));
  }

  function updateActivePost(
    change: (post: ComposerPost) => Partial<ComposerPost>,
  ) {
    updatePost(snapshot.activeIndex, change);
  }

  return {
    snapshot,
    activePost,
    replace: setSnapshot,
    reset: () => setSnapshot(createEmptySnapshot()),
    setText: (index: number, text: string) => updatePost(index, () => ({ text })),
    focusPost: (index: number) =>
      setSnapshot((current) =>
        current.activeIndex === index
          ? current
          : { ...current, activeIndex: index },
      ),
    addPost: () =>
      setSnapshot((current) => {
        const at = current.activeIndex + 1;
        const posts = [...current.posts];
        posts.splice(at, 0, createEmptyPost());
        return { ...current, posts, activeIndex: at };
      }),
    removePost: (index: number) =>
      setSnapshot((current) => {
        if (current.posts.length === 1) return current;
        const posts = current.posts.filter((_, position) => position !== index);
        return {
          ...current,
          posts,
          activeIndex: Math.min(Math.max(index - 1, 0), posts.length - 1),
        };
      }),
    addMedia: (items: ComposerMedia[]) =>
      updateActivePost((post) => {
        const media = [...post.media, ...items];
        const mixesGif =
          media.length > 1 && media.some((item) => item.kind === "gif");
        if (mixesGif || post.poll) return {};
        return { media: media.slice(0, MAX_MEDIA_PER_POST) };
      }),
    removeMedia: (index: number, mediaId: string) =>
      updatePost(index, (post) => ({
        media: post.media.filter((item) => item.id !== mediaId),
      })),
    updateMedia: (
      index: number,
      mediaId: string,
      change: Partial<ComposerMedia>,
    ) =>
      updatePost(index, (post) => ({
        media: post.media.map((item) =>
          item.id === mediaId ? { ...item, ...change } : item,
        ),
      })),
    setPoll: (index: number, poll: ComposerPoll | null) =>
      updatePost(index, () => ({ poll })),
    setReplySettings: (replySettings: ReplySettings) =>
      setSnapshot((current) => ({ ...current, replySettings })),
    setScheduledAt: (scheduledAt: string | null) =>
      setSnapshot((current) => ({ ...current, scheduledAt })),
    setDisclosure: (disclosure: ContentDisclosure) =>
      setSnapshot((current) => ({ ...current, disclosure })),
  };
}
