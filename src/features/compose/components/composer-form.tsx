"use client";

import { useEffect, useRef, useState } from "react";
import type { UserSummary } from "@/types/user";
import { MAX_TWEET_LENGTH } from "@/config/tweet";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CloseIcon, PlusIcon, ScheduleIcon } from "@/components/ui/icons";
import { Tooltip } from "@/components/ui/tooltip";
import type { ComposeTarget } from "@/features/compose/types/compose-target";
import type { ComposerPost } from "@/features/compose/types/composer";
import type { Composer } from "@/features/compose/hooks/use-composer";
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
import { ComposeQuoteCard } from "@/features/compose/components/compose-quote-card";
import { PollEditor } from "@/features/compose/components/poll-editor";
import { AudienceMenu } from "@/features/compose/components/audience-menu";
import {
  canPublish,
  countCharacters,
  hasContent,
} from "@/features/compose/utils/composer-status";
import {
  isPostEmpty,
  toNewPosts,
} from "@/features/compose/utils/composer-snapshot";
import { formatScheduleDate } from "@/features/compose/utils/format-schedule";
import { cn } from "@/lib/utils";

const FLOATING_LAYERS = "[role=menu], [role=dialog]";

const placeholders = {
  post: "What’s happening?",
  reply: "Post your reply",
  quote: "Add a comment",
} as const;

type ComposerFormProps = {
  viewer: UserSummary;
  composer: Composer;
  variant: "inline" | "modal";
  target: ComposeTarget | null;
  onAddPost: () => void;
  onPublished?: () => void;
};

export function ComposerForm({
  viewer,
  composer,
  variant,
  target,
  onAddPost,
  onPublished,
}: ComposerFormProps) {
  const modal = variant === "modal";
  const kind = target?.kind ?? "post";
  const { snapshot, activePost } = composer;
  const { posts, activeIndex, scheduledAt } = snapshot;
  const thread = posts.length > 1;

  const textareas = useRef(new Map<string, HTMLTextAreaElement>());
  const focusRequest = useRef(false);
  const { tools, picker, setPicker, emojiButtonRef, fileInputRef } =
    useComposerTools(composer, { withPollAndSchedule: true });
  const [engaged, setEngaged] = useState(modal);
  const { pending, publish } = usePublish({ onSettled: onPublished });

  useEffect(() => {
    if (!focusRequest.current) return;
    focusRequest.current = false;
    textareas.current.get(activePost.id)?.focus();
  }, [activePost.id]);

  const activeLength = countCharacters(activePost.text);
  const ready = canPublish(snapshot, kind === "quote") && !pending;

  function addPost() {
    if (!modal) {
      onAddPost();
      return;
    }
    focusRequest.current = true;
    composer.addPost();
  }

  function post() {
    publish(
      {
        posts: toNewPosts(posts),
        replyToId: kind === "reply" ? (target?.tweet.id ?? null) : null,
        quotedId: kind === "quote" ? (target?.tweet.id ?? null) : null,
        replySettings: snapshot.replySettings,
        scheduledAt,
        draftId: snapshot.draftId,
      },
      () => {
        composer.reset();
        setEngaged(modal);
      },
    );
  }

  function placeholderFor(post: ComposerPost, index: number) {
    if (index > 0) return "Add another post";
    return post.poll ? "Ask a question" : placeholders[kind];
  }

  const postLabel = scheduledAt
    ? "Schedule"
    : thread
      ? "Post all"
      : kind === "reply"
        ? "Reply"
        : "Post";

  const editors = posts.map((post, index) => {
    const active = index === activeIndex;
    return (
      <PostEditor
        key={post.id}
        post={post}
        index={index}
        active={active}
        dimmed={thread && !active}
        modal={modal}
        showAvatar={modal}
        viewer={viewer}
        placeholder={placeholderFor(post, index)}
        scheduledAt={index === 0 ? scheduledAt : null}
        quoted={index === 0 && target?.kind === "quote" ? target : null}
        last={index === posts.length - 1}
        removable={thread}
        registerTextarea={(element) => {
          if (element) textareas.current.set(post.id, element);
          else textareas.current.delete(post.id);
        }}
        onFocus={() => composer.focusPost(index)}
        onTextChange={(text) => composer.setText(index, text)}
        onRemove={() => {
          focusRequest.current = true;
          composer.removePost(index);
        }}
        onOpenSchedule={() => setPicker("schedule")}
        composer={composer}
      />
    );
  });

  const footer = (
    <>
      {kind === "reply" ? null : (
        <div
          className={cn(
            "overflow-hidden",
            "-ml-4 mr-4",
            modal
              ? "max-h-[60px]"
              : cn(
                  "transition-[max-height,opacity] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  engaged ? "max-h-[60px] opacity-100" : "max-h-0 opacity-0",
                ),
          )}
        >
          <div className="flex border-b border-border py-3">
            <AudienceMenu
              value={snapshot.replySettings}
              onChange={composer.setReplySettings}
            />
          </div>
        </div>
      )}

      <div className="flex items-center pt-2">
        <ComposerToolbar tools={tools} />
        <div className="ml-auto flex items-center gap-3">
          <CharacterCounter length={activeLength} />
          {kind !== "reply" && !isPostEmpty(activePost) && !scheduledAt ? (
            <>
              <span aria-hidden className="h-[31px] w-px bg-border-strong" />
              <Tooltip label="Add post">
                <button
                  type="button"
                  aria-label="Add post"
                  onClick={addPost}
                  disabled={activeLength > MAX_TWEET_LENGTH}
                  className="-mx-1.5 flex size-9 items-center justify-center rounded-full text-accent transition-colors duration-200 ease-[ease] hover:bg-accent/10 disabled:opacity-50"
                >
                  <span className="flex size-6 items-center justify-center rounded-full border border-outline">
                    <PlusIcon className="size-4" />
                  </span>
                </button>
              </Tooltip>
            </>
          ) : null}
          <Button
            disabled={!ready}
            onClick={post}
            className="disabled:opacity-25"
          >
            {postLabel}
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div
      onFocusCapture={() => setEngaged(true)}
      onBlurCapture={(event) => {
        if (modal || picker || hasContent(snapshot)) return;
        const next = event.relatedTarget;
        if (next instanceof Element) {
          if (event.currentTarget.contains(next)) return;
          if (next.closest(FLOATING_LAYERS)) return;
        }
        setEngaged(false);
      }}
      className={cn(
        "relative",
        modal ? "flex flex-col" : "border-b border-border",
      )}
    >
      {pending ? (
        <div
          role="progressbar"
          aria-label="Posting"
          className="absolute inset-x-0 top-0 z-1 h-[3px]"
        >
          <div className="t-progress-fill h-full bg-accent" />
        </div>
      ) : null}

      {modal ? (
        <>
          <div className="flex flex-col">{editors}</div>
          <div className="px-4 pb-2">{footer}</div>
        </>
      ) : (
        <div className="flex gap-2 px-4 pt-4 pb-2">
          <Avatar src={viewer.avatarUrl} alt={viewer.displayName} />
          <div className="flex min-w-0 flex-1 flex-col">
            {editors}
            {footer}
          </div>
        </div>
      )}

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

type PostEditorProps = {
  post: ComposerPost;
  index: number;
  active: boolean;
  dimmed: boolean;
  modal: boolean;
  showAvatar: boolean;
  viewer: UserSummary;
  placeholder: string;
  scheduledAt: string | null;
  quoted: ComposeTarget | null;
  last: boolean;
  removable: boolean;
  composer: Composer;
  registerTextarea: (element: HTMLTextAreaElement | null) => void;
  onFocus: () => void;
  onTextChange: (text: string) => void;
  onRemove: () => void;
  onOpenSchedule: () => void;
};

function PostEditor({
  post,
  index,
  active,
  dimmed,
  modal,
  showAvatar,
  viewer,
  placeholder,
  scheduledAt,
  quoted,
  last,
  removable,
  composer,
  registerTextarea,
  onFocus,
  onTextChange,
  onRemove,
  onOpenSchedule,
}: PostEditorProps) {
  const overLimit = countCharacters(post.text) > MAX_TWEET_LENGTH;

  const body = (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col",
        dimmed && "opacity-50 transition-opacity duration-200 ease-[ease]",
      )}
    >
      {scheduledAt ? (
        <button
          type="button"
          onClick={onOpenSchedule}
          className="flex items-center gap-1.5 self-start pt-1.5 text-xs text-muted hover:underline"
        >
          <ScheduleIcon className="size-4" />
          <span suppressHydrationWarning>
            Will send on {formatScheduleDate(scheduledAt)}
          </span>
        </button>
      ) : null}
      <div
        className={cn(
          "pt-1.5",
          !modal && "min-h-12",
          modal && "pb-3.5",
        )}
      >
        <ComposerTextarea
          textareaRef={registerTextarea}
          value={post.text}
          onValueChange={onTextChange}
          onFocus={onFocus}
          placeholder={placeholder}
          aria-label={index === 0 ? "Post text" : `Post text ${index + 1}`}
          className={cn(modal && !quoted && last && "min-h-24")}
        />
        {overLimit ? <PremiumUpsell /> : null}
        {post.media.length > 0 ? (
          <ComposerMedia
            media={post.media}
            onRemove={(mediaId) => composer.removeMedia(index, mediaId)}
            onAltChange={(mediaId, alt) =>
              composer.updateMedia(index, mediaId, { alt })
            }
          />
        ) : null}
        {post.poll ? (
          <PollEditor
            poll={post.poll}
            onChange={(poll) => composer.setPoll(index, poll)}
            onRemove={() => composer.setPoll(index, null)}
          />
        ) : null}
        {quoted ? <ComposeQuoteCard tweet={quoted.tweet} /> : null}
      </div>
    </div>
  );

  if (!showAvatar) return body;

  return (
    <div
      className={cn("flex gap-2 px-4", index === 0 ? "pt-4" : "pt-5")}
    >
      <Avatar
        src={viewer.avatarUrl}
        alt={viewer.displayName}
        className={cn(dimmed && "opacity-50")}
      />
      {body}
      {removable && active ? (
        <Tooltip label="Remove post">
          <button
            type="button"
            aria-label="Remove post"
            onClick={onRemove}
            className="-mt-1.5 mr-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-accent transition-colors duration-200 ease-[ease] hover:bg-accent/10"
          >
            <CloseIcon className="size-4" />
          </button>
        </Tooltip>
      ) : null}
    </div>
  );
}
