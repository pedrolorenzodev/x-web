"use client";

import { useId, useState } from "react";
import type { Tweet } from "@/types/tweet";
import { Avatar } from "@/components/ui/avatar";
import { FloatingLabelSelect } from "@/components/ui/floating-label-field";
import { IconButton } from "@/components/ui/icon-button";
import { SettingsIcon, XLogoIcon } from "@/components/ui/icons";
import { Modal, ModalHeader } from "@/components/ui/modal";
import { Switch } from "@/components/ui/switch";
import { showToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { formatFullDate } from "@/utils/format-full-date";

const AUTOMATIC = "auto";

const languages = [
  { value: AUTOMATIC, label: "Automatic" },
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic" },
  { value: "bn", label: "Bangla" },
  { value: "cs", label: "Czech" },
  { value: "da", label: "Danish" },
  { value: "de", label: "German" },
  { value: "el", label: "Greek" },
  { value: "es", label: "Spanish" },
  { value: "fa", label: "Persian" },
  { value: "fi", label: "Finnish" },
  { value: "fil", label: "Filipino" },
  { value: "fr", label: "French" },
  { value: "he", label: "Hebrew" },
  { value: "hi", label: "Hindi" },
  { value: "hu", label: "Hungarian" },
  { value: "id", label: "Indonesian" },
  { value: "it", label: "Italian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "msa", label: "Malay" },
  { value: "nl", label: "Dutch" },
  { value: "no", label: "Norwegian" },
  { value: "pl", label: "Polish" },
  { value: "pt", label: "Portuguese" },
  { value: "ro", label: "Romanian" },
  { value: "ru", label: "Russian" },
  { value: "sv", label: "Swedish" },
  { value: "th", label: "Thai" },
  { value: "tr", label: "Turkish" },
  { value: "uk", label: "Ukrainian" },
  { value: "ur", label: "Urdu" },
  { value: "vi", label: "Vietnamese" },
  { value: "zh-cn", label: "Chinese (China)" },
  { value: "zh-tw", label: "Chinese (Taiwan)" },
];

type EmbedSettings = {
  dark: boolean;
  language: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function embedCode(tweet: Tweet, url: string, settings: EmbedSettings) {
  const date = new Date(tweet.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const attributes = [
    'class="twitter-tweet"',
    settings.language === AUTOMATIC ? null : `data-lang="${settings.language}"`,
    settings.dark ? 'data-theme="dark"' : null,
  ]
    .filter(Boolean)
    .join(" ");
  return `<blockquote ${attributes}><p>${escapeHtml(tweet.text)}</p>&mdash; ${escapeHtml(tweet.author.displayName)} (@${tweet.author.handle}) <a href="${url}">${date}</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`;
}

type EmbedModalProps = {
  tweet: Tweet;
  path: string;
  onClose: () => void;
};

export function EmbedModal({ tweet, path, onClose }: EmbedModalProps) {
  const titleId = useId();
  const [view, setView] = useState<"code" | "settings">("code");
  const [settings, setSettings] = useState<EmbedSettings>({
    dark: false,
    language: AUTOMATIC,
  });

  async function copyCode() {
    const url = new URL(path, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(embedCode(tweet, url, settings));
      showToast({ message: "Copied to clipboard" });
    } catch {
      showToast({ message: "Couldn’t copy the code" });
    }
    onClose();
  }

  if (view === "settings") {
    return (
      <Modal
        labelledBy={titleId}
        onClose={onClose}
        className="h-auto bg-elevated max-[702px]:h-auto"
      >
        <ModalHeader
          onBack={() => setView("code")}
          title="Embed settings"
          titleId={titleId}
          className="bg-elevated/85"
        />
        <div className="flex flex-col px-4 pt-3 pb-6">
          <div className="py-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-base">Dark theme</span>
              <Switch
                size="sm"
                label="Dark theme"
                checked={settings.dark}
                onChange={(dark) => setSettings({ ...settings, dark })}
              />
            </div>
            <p className="mt-3 text-xs text-muted">
              Use a dark background for the embedded post.
            </p>
          </div>
          <FloatingLabelSelect
            label="Language"
            value={settings.language}
            options={languages}
            onChange={(language) => setSettings({ ...settings, language })}
            className="mt-4"
          />
          <p className="px-2 pt-1 text-xs text-muted">
            What language would you like to display this in?
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      labelledBy={titleId}
      placement="top"
      onClose={onClose}
      className="h-[810px] bg-elevated max-[702px]:h-full"
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <ModalHeader
          onClose={onClose}
          title="Embed this post"
          titleId={titleId}
          className="bg-elevated"
          action={
            <IconButton
              label="Embed settings"
              tone="plain"
              onClick={() => setView("settings")}
              className="-mr-2 size-9"
            >
              <SettingsIcon className="size-5" />
            </IconButton>
          }
        />
        <div className="p-4">
          <p className="text-base text-muted">
            Preview how this post looks when embedded on another website.
          </p>
          <EmbedPreview tweet={tweet} dark={settings.dark} />
        </div>
      </div>
      <div className="shrink-0 border-t border-border p-4">
        <button
          type="button"
          onClick={copyCode}
          className="flex h-11 w-full items-center justify-center rounded-full bg-inverted px-6 text-base font-bold text-inverted-foreground transition-colors duration-200 ease-[ease] hover:bg-inverted-hover"
        >
          Copy code
        </button>
        <p className="mt-3 text-xs text-muted">
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

function EmbedPreview({ tweet, dark }: { tweet: Tweet; dark: boolean }) {
  return (
    <div
      className={cn(
        "mt-5 rounded-xl border p-4 transition-colors duration-200 ease-[ease]",
        dark
          ? "border-border bg-background text-foreground"
          : "border-inverted bg-white text-inverted-foreground",
      )}
    >
      <div className="flex items-start gap-1">
        <Avatar src={tweet.author.avatarUrl} alt={tweet.author.displayName} />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-base font-bold">
            {tweet.author.displayName}
          </span>
          <span className="truncate text-base text-muted">
            @{tweet.author.handle}
          </span>
        </span>
        <XLogoIcon className="size-[30px] shrink-0" />
      </div>
      <p className="mt-3 text-xl leading-6 break-words whitespace-pre-wrap">
        {tweet.text}
      </p>
      <p className="mt-3 text-base text-muted">
        {formatFullDate(tweet.createdAt)}
      </p>
    </div>
  );
}
