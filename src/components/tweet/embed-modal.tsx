"use client";

import { useId } from "react";
import type { Tweet } from "@/types/tweet";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Modal, ModalHeader } from "@/components/ui/modal";
import { showToast } from "@/components/ui/toast";
import { formatFullDate } from "@/utils/format-full-date";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function embedCode(tweet: Tweet, url: string) {
  const date = new Date(tweet.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `<blockquote class="twitter-tweet"><p>${escapeHtml(tweet.text)}</p>&mdash; ${escapeHtml(tweet.author.displayName)} (@${tweet.author.handle}) <a href="${url}">${date}</a></blockquote>`;
}

type EmbedModalProps = {
  tweet: Tweet;
  path: string;
  onClose: () => void;
};

export function EmbedModal({ tweet, path, onClose }: EmbedModalProps) {
  const titleId = useId();

  async function copyCode() {
    const url = new URL(path, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(embedCode(tweet, url));
      showToast({ message: "Copied to clipboard" });
    } catch {
      showToast({ message: "Couldn’t copy the code" });
    }
    onClose();
  }

  return (
    <Modal labelledBy={titleId} onClose={onClose} className="bg-elevated">
      <ModalHeader onClose={onClose} className="bg-elevated/85" />
      <div className="flex min-h-0 flex-col overflow-y-auto px-8 pb-8">
        <h1 id={titleId} className="text-[23px] leading-7 font-bold">
          Embed this post
        </h1>
        <p className="mt-2 text-base text-muted">
          Preview how this post looks when embedded on another website.
        </p>
        <div className="mt-6 rounded-2xl border border-border p-4">
          <div className="flex items-center gap-3">
            <Avatar src={tweet.author.avatarUrl} alt={tweet.author.displayName} />
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-base font-bold">
                {tweet.author.displayName}
              </span>
              <span className="truncate text-base text-muted">
                @{tweet.author.handle}
              </span>
            </span>
          </div>
          <p className="mt-3 text-lg break-words whitespace-pre-wrap">
            {tweet.text}
          </p>
          <p className="mt-3 text-base text-muted">
            {formatFullDate(tweet.createdAt)}
          </p>
        </div>
        <Button variant="accent" size="lg" onClick={copyCode} className="mt-6 h-13">
          Copy code
        </Button>
        <p className="mt-4 text-xs text-muted">
          By embedding X content in your website or app, you are agreeing to
          the{" "}
          <a
            href="https://developer.x.com/en/developer-terms/agreement"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Developer Agreement
          </a>{" "}
          and{" "}
          <a
            href="https://developer.x.com/en/developer-terms/policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Developer Policy
          </a>
          .
        </p>
      </div>
    </Modal>
  );
}
