"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { UserSummary } from "@/types/user";
import { routes } from "@/config/routes";
import { MAX_TWEET_LENGTH } from "@/config/tweet";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useComposer } from "@/features/compose/hooks/use-composer";
import { useComposerTools } from "@/features/compose/hooks/use-composer-tools";
import { usePublish } from "@/features/compose/hooks/use-publish";
import { ComposerToolbar } from "@/features/compose/components/composer-toolbar";
import { ComposerPickers } from "@/features/compose/components/composer-pickers";
import { CharacterCounter } from "@/features/compose/components/character-counter";
import {
  ComposerTextarea,
  PremiumUpsell,
} from "@/features/compose/components/composer-textarea";
import { ComposerMedia } from "@/features/compose/components/composer-media";
import {
  canPublish,
  countCharacters,
} from "@/features/compose/utils/composer-status";
import {
  createEmptySnapshot,
  toNewPosts,
} from "@/features/compose/utils/composer-snapshot";
import { cn } from "@/lib/utils";

type ReplyComposerProps = {
  viewer: UserSummary;
  replyTo: UserSummary;
  tweetId: string;
};

export function ReplyComposer({
  viewer,
  replyTo,
  tweetId,
}: ReplyComposerProps) {
  const composer = useComposer(createEmptySnapshot);
  const { snapshot, activePost: post } = composer;
  const { tools, picker, setPicker, emojiButtonRef, fileInputRef } =
    useComposerTools(composer, { withPollAndSchedule: false });
  const [expanded, setExpanded] = useState(false);
  const { pending, publish } = usePublish();
  const textareas = useRef(new Map<string, HTMLTextAreaElement>());
  const length = countCharacters(post.text);

  function reply() {
    publish(
      {
        posts: toNewPosts(snapshot.posts),
        replyToId: tweetId,
        quotedId: null,
        replySettings: snapshot.replySettings,
        scheduledAt: null,
        draftId: null,
      },
      () => {
        composer.reset();
        setExpanded(false);
        textareas.current.forEach((textarea) => textarea.blur());
      },
    );
  }

  return (
    <div
      className={cn(
        "relative border-b border-border px-4 pt-1",
        expanded ? "pb-5" : "pb-3",
      )}
    >
      {pending ? (
        <div
          role="progressbar"
          aria-label="Posting"
          className="absolute inset-x-0 top-0 h-[3px]"
        >
          <div className="t-progress-fill h-full bg-accent" />
        </div>
      ) : null}

      {expanded ? (
        <div className="ml-12 flex h-5 items-center gap-1 text-base text-muted">
          Replying to
          <Link
            href={routes.profile(replyTo.handle)}
            className="text-accent hover:underline"
          >
            @{replyTo.handle}
          </Link>
        </div>
      ) : null}

      <div
        className={cn(
          "flex gap-2",
          expanded ? "mt-3" : "h-[68px] items-center",
        )}
      >
        <Avatar src={viewer.avatarUrl} alt={viewer.displayName} />

        <div
          className={cn(
            "flex min-w-0 flex-1",
            expanded ? "flex-col" : "h-14 items-center",
          )}
        >
          <div className={cn("min-w-0 flex-1", expanded && "min-h-12 pt-1.5")}>
            <ComposerTextarea
              textareaRef={(element) => {
                if (element) textareas.current.set(post.id, element);
                else textareas.current.delete(post.id);
              }}
              value={post.text}
              onValueChange={(text) => composer.setText(0, text)}
              onFocus={() => setExpanded(true)}
              placeholder="Post your reply"
              aria-label="Post text"
              rows={1}
              className={cn(!expanded && "py-0")}
            />
            {length > MAX_TWEET_LENGTH ? <PremiumUpsell /> : null}
            {post.media.length > 0 ? (
              <ComposerMedia
                media={post.media}
                onRemove={(mediaId) => composer.removeMedia(0, mediaId)}
                onAltChange={(mediaId, alt) =>
                  composer.updateMedia(0, mediaId, { alt })
                }
              />
            ) : null}
          </div>

          <div className={cn("flex items-center", expanded && "pt-2")}>
            {expanded ? <ComposerToolbar tools={tools} /> : null}
            <div
              className={cn(
                "flex items-center gap-3",
                expanded ? "ml-auto" : "ml-3",
              )}
            >
              {expanded ? <CharacterCounter length={length} /> : null}
              <Button
                disabled={!canPublish(snapshot, false) || pending}
                onClick={reply}
                className="disabled:opacity-25"
              >
                Reply
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ComposerPickers
        composer={composer}
        picker={picker}
        setPicker={setPicker}
        emojiButtonRef={emojiButtonRef}
        fileInputRef={fileInputRef}
        textareas={textareas}
      />
    </div>
  );
}
