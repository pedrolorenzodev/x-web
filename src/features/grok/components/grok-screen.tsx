"use client";

import Image from "next/image";
import { useState, type ComponentType, type SVGProps } from "react";
import { LayoutMode } from "@/components/layout/layout-mode";
import {
  ArrowUpIcon,
  ChatHistoryIcon,
  FocusModeIcon,
  GrokWordmarkIcon,
  LinkIcon,
  PaperclipIcon,
  PrivateChatIcon,
  VoiceModeIcon,
} from "@/components/ui/icons";
import { showToast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";
import {
  grokLinks,
  grokPromo,
  grokUnavailableMessage,
} from "@/features/grok/config/grok";
import { GrokModelMenu } from "@/features/grok/components/grok-model-menu";
import { GrokLinkAccountsModal } from "@/features/grok/components/grok-link-accounts-modal";
import { cn } from "@/lib/utils";

type ToggleName = "history" | "private";

type TopButtonProps = {
  label: string;
  ariaLabel?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  selected?: boolean;
  onClick: () => void;
};

function TopButton({
  label,
  ariaLabel,
  icon: Icon,
  selected = false,
  onClick,
}: TopButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel ?? label}
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "flex h-8 items-center gap-1 rounded-xl border border-transparent px-4 text-sm font-bold transition-colors duration-200 ease-[ease]",
        selected ? "bg-[rgb(24_25_25)]" : "hover:bg-white/10",
      )}
    >
      <Icon className="size-[18px] shrink-0" />
      <span className="max-[699px]:hidden">{label}</span>
    </button>
  );
}

function notifyUnavailable() {
  showToast({ message: grokUnavailableMessage });
}

export function GrokScreen() {
  const [prompt, setPrompt] = useState("");
  const [focusMode, setFocusMode] = useState(false);
  const [linking, setLinking] = useState(false);
  const [toggled, setToggled] = useState<ToggleName | null>(null);
  const hasPrompt = prompt.trim() !== "";

  function toggle(name: ToggleName) {
    setToggled((current) => (current === name ? null : name));
  }

  return (
    <div className="flex min-h-screen w-[min(978px,calc(100vw-90px))] flex-col max-[599px]:w-[calc(100vw-70px)] max-[499px]:w-screen min-[988px]:w-[min(978px,calc(100vw-100px))] min-[989px]:max-[1007px]:w-[calc(100vw-80px)] min-[1265px]:w-[min(978px,calc(100vw-287px))] layout-fullwidth:w-full">
      <LayoutMode mode={focusMode ? "fullwidth" : "no-panel"} />

      <div className="flex h-[70px] shrink-0 items-center justify-between px-4">
        <Tooltip label="Focus Mode">
          <button
            type="button"
            aria-label="Focus Mode"
            aria-pressed={focusMode}
            onClick={() => setFocusMode((current) => !current)}
            className={cn(
              "flex size-9 items-center justify-center rounded-xl border border-transparent transition-colors duration-200 ease-[ease]",
              focusMode ? "bg-[rgb(24_25_25)]" : "hover:bg-white/10",
            )}
          >
            <FocusModeIcon className="size-5" />
          </button>
        </Tooltip>
        <div className="flex items-center">
          <TopButton
            label="History"
            ariaLabel="Chat history"
            icon={ChatHistoryIcon}
            selected={toggled === "history"}
            onClick={() => toggle("history")}
          />
          <TopButton
            label="Private"
            icon={PrivateChatIcon}
            selected={toggled === "private"}
            onClick={() => toggle("private")}
          />
          <TopButton
            label="Link accounts"
            icon={LinkIcon}
            onClick={() => setLinking(true)}
          />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center pb-[70px]">
        <div className="w-full max-w-[800px] px-4">
          <h1 className="flex justify-center">
            <GrokWordmarkIcon
              aria-label="Grok"
              role="img"
              className="h-11 w-[120px]"
            />
          </h1>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              notifyUnavailable();
            }}
            className="mt-4 flex items-end gap-1 rounded-[32px] border border-transparent bg-[rgb(31_33_37)] py-[10px] pr-3 pl-2 transition-[border-color] duration-200 focus-within:border-border-strong"
          >
            <button
              type="button"
              aria-label="Attach"
              onClick={notifyUnavailable}
              className="flex h-[39px] w-[38px] shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-200 ease-[ease] hover:bg-white/10 hover:text-foreground"
            >
              <PaperclipIcon className="size-5" />
            </button>
            <textarea
              value={prompt}
              rows={1}
              placeholder="Ask anything"
              aria-label="Ask Grok"
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              className="field-sizing-content max-h-[200px] min-h-[39px] min-w-0 flex-1 resize-none bg-transparent px-1 py-[9px] text-base leading-5 outline-none placeholder:text-muted"
            />
            <GrokModelMenu />
            {hasPrompt ? (
              <button
                type="submit"
                aria-label="Grok something"
                className="flex h-[35px] w-[34px] shrink-0 items-center justify-center rounded-full bg-inverted text-inverted-foreground transition-colors duration-200 ease-[ease] hover:bg-inverted-hover"
              >
                <ArrowUpIcon className="size-5" />
              </button>
            ) : (
              <button
                type="button"
                aria-label="Enter voice mode"
                onClick={notifyUnavailable}
                className="flex h-[35px] w-[34px] shrink-0 items-center justify-center rounded-full bg-inverted text-inverted-foreground transition-colors duration-200 ease-[ease] hover:bg-inverted-hover"
              >
                <VoiceModeIcon className="size-5" />
              </button>
            )}
          </form>

          <div className="mt-4 flex min-h-[90px] items-center gap-4 rounded-2xl border border-[rgb(42_45_48)] py-1.5 pr-4 pl-4">
            <Image
              src="/media/grok-bot.svg"
              alt=""
              width={80}
              height={80}
              unoptimized
              className="size-20 shrink-0 rounded-lg max-[499px]:size-14"
            />
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold">{grokPromo.title}</p>
              <p className="mt-1 text-sm text-muted">{grokPromo.body}</p>
            </div>
            <a
              href={grokLinks.grokBot}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 shrink-0 items-center rounded-full bg-inverted px-4 text-sm font-bold text-inverted-foreground transition-colors duration-200 ease-[ease] hover:bg-inverted-hover"
            >
              {grokPromo.action}
            </a>
          </div>
        </div>
      </div>

      {linking ? (
        <GrokLinkAccountsModal onClose={() => setLinking(false)} />
      ) : null}
    </div>
  );
}
