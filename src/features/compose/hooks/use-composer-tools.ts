import { useRef, useState } from "react";
import { MAX_MEDIA_PER_POST } from "@/config/compose";
import {
  EmojiIcon,
  FlagIcon,
  GifIcon,
  LocationIcon,
  MediaIcon,
  PollIcon,
  ScheduleIcon,
} from "@/components/ui/icons";
import type { ComposerTool } from "@/features/compose/components/composer-toolbar";
import type { Composer } from "@/features/compose/hooks/use-composer";
import { createEmptyPoll } from "@/features/compose/utils/composer-snapshot";

export type ComposerPicker = "emoji" | "gif" | "schedule" | "disclosure";

type ComposerToolsOptions = {
  withPollAndSchedule: boolean;
};

export function useComposerTools(
  composer: Composer,
  { withPollAndSchedule }: ComposerToolsOptions,
) {
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [picker, setPicker] = useState<ComposerPicker | null>(null);

  const { snapshot, activePost } = composer;
  const hasPoll = Boolean(activePost.poll);
  const hasGif = activePost.media.some((item) => item.kind === "gif");
  const hasMedia = activePost.media.length > 0;
  const thread = snapshot.posts.length > 1;
  const restrictedReplies = snapshot.replySettings !== "everyone";
  const disclosed =
    snapshot.disclosure.paidPartnership || snapshot.disclosure.madeWithAi;

  const tools: ComposerTool[] = [
    {
      label: "Add photos or video",
      tooltip: "Media",
      icon: MediaIcon,
      disabled:
        hasPoll || hasGif || activePost.media.length >= MAX_MEDIA_PER_POST,
      onClick: () => fileInputRef.current?.click(),
    },
    {
      label: "Add a GIF",
      tooltip: "GIF",
      icon: GifIcon,
      disabled: hasPoll || hasMedia,
      onClick: () => setPicker("gif"),
    },
    ...(withPollAndSchedule
      ? [
          {
            label: "Add poll",
            tooltip: "Poll",
            wideOnly: true,
            icon: PollIcon,
            disabled: hasPoll || hasMedia,
            onClick: () =>
              composer.setPoll(snapshot.activeIndex, createEmptyPoll()),
          },
        ]
      : []),
    {
      label: "Add emoji",
      tooltip: "Emoji",
      icon: EmojiIcon,
      active: picker === "emoji",
      buttonRef: emojiButtonRef,
      onClick: () => setPicker(picker === "emoji" ? null : "emoji"),
    },
    ...(withPollAndSchedule
      ? [
          {
            label: "Schedule post",
            tooltip: "Schedule",
            wideOnly: true,
            icon: ScheduleIcon,
            disabled: hasPoll || thread || restrictedReplies,
            active: Boolean(snapshot.scheduledAt),
            onClick: () => setPicker("schedule"),
          },
        ]
      : []),
    {
      label: "Tag location",
      tooltip: "Location",
      icon: LocationIcon,
      disabled: true,
    },
    {
      label: "Content disclosure",
      tooltip: "Content disclosure",
      icon: FlagIcon,
      active: disclosed,
      onClick: () => setPicker("disclosure"),
    },
  ];

  return { tools, picker, setPicker, emojiButtonRef, fileInputRef };
}
