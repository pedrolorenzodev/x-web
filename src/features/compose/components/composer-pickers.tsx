"use client";

import type { ChangeEvent, RefObject } from "react";
import type { Gif } from "@/types/gif";
import { MAX_MEDIA_PER_POST } from "@/config/compose";
import type { Composer } from "@/features/compose/hooks/use-composer";
import type { ComposerPicker } from "@/features/compose/hooks/use-composer-tools";
import { EmojiPicker } from "@/features/compose/components/emoji-picker";
import { GifPickerModal } from "@/features/compose/components/gif-picker-modal";
import { ScheduleModal } from "@/features/compose/components/schedule-modal";
import { ContentDisclosureModal } from "@/features/compose/components/content-disclosure-modal";
import { createLocalId } from "@/features/compose/utils/composer-snapshot";
import {
  ACCEPTED_PHOTO_TYPES,
  readPhoto,
} from "@/features/compose/utils/read-photo";

const GIF_WIDTH = 480;

type ComposerPickersProps = {
  composer: Composer;
  picker: ComposerPicker | null;
  setPicker: (picker: ComposerPicker | null) => void;
  emojiButtonRef: RefObject<HTMLButtonElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
  textareas: RefObject<Map<string, HTMLTextAreaElement>>;
};

export function ComposerPickers({
  composer,
  picker,
  setPicker,
  emojiButtonRef,
  fileInputRef,
  textareas,
}: ComposerPickersProps) {
  const { snapshot, activePost } = composer;

  function insertEmoji(emoji: string) {
    const textarea = textareas.current.get(activePost.id);
    const { text } = activePost;
    const start = textarea?.selectionStart ?? text.length;
    const end = textarea?.selectionEnd ?? text.length;
    composer.setText(
      snapshot.activeIndex,
      text.slice(0, start) + emoji + text.slice(end),
    );
    requestAnimationFrame(() => {
      if (!textarea) return;
      const caret = start + emoji.length;
      textarea.focus();
      textarea.setSelectionRange(caret, caret);
    });
  }

  async function attachFiles(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const slots = MAX_MEDIA_PER_POST - activePost.media.length;
    const files = Array.from(input.files ?? [])
      .filter((file) => ACCEPTED_PHOTO_TYPES.includes(file.type))
      .slice(0, slots);
    input.value = "";
    const photos = await Promise.all(files.map(readPhoto));
    composer.addMedia(
      photos.map((photo) => ({
        id: createLocalId("media"),
        kind: "photo",
        alt: "",
        ...photo,
      })),
    );
  }

  function attachGif(gif: Gif) {
    setPicker(null);
    composer.addMedia([
      {
        id: createLocalId("media"),
        kind: "gif",
        url: gif.stillUrl,
        videoUrl: gif.videoUrl,
        width: GIF_WIDTH,
        height: Math.round(GIF_WIDTH / gif.aspectRatio),
        alt: gif.alt,
      },
    ]);
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_PHOTO_TYPES.join(",")}
        multiple
        hidden
        onChange={attachFiles}
      />
      {picker === "emoji" ? (
        <EmojiPicker
          anchorRef={emojiButtonRef}
          onSelect={insertEmoji}
          onClose={() => setPicker(null)}
        />
      ) : null}
      {picker === "gif" ? (
        <GifPickerModal onSelect={attachGif} onClose={() => setPicker(null)} />
      ) : null}
      {picker === "schedule" ? (
        <ScheduleModal
          value={snapshot.scheduledAt}
          onConfirm={(value) => {
            composer.setScheduledAt(value);
            setPicker(null);
          }}
          onClear={() => {
            composer.setScheduledAt(null);
            setPicker(null);
          }}
          onClose={() => setPicker(null)}
        />
      ) : null}
      {picker === "disclosure" ? (
        <ContentDisclosureModal
          value={snapshot.disclosure}
          onDone={(value) => {
            composer.setDisclosure(value);
            setPicker(null);
          }}
        />
      ) : null}
    </>
  );
}
