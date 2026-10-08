import Link from "next/link";
import type { ReactNode } from "react";
import { routes } from "@/config/routes";
import { ChatBubbleIcon, GrokIcon } from "@/components/ui/icons";

function DockButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex size-[55px] items-center justify-center rounded-2xl border border-dock-border bg-background/65 shadow-[0_0_15px_rgb(255_255_255/0.2),0_0_3px_1px_rgb(255_255_255/0.15)] backdrop-blur-[12px] transition-colors duration-200 ease-[ease] hover:bg-accent/10"
    >
      {children}
    </Link>
  );
}

export function FloatingDock() {
  return (
    <div className="fixed right-5 bottom-3 z-20 hidden flex-col gap-3 min-[1078px]:flex layout-fullwidth:hidden! layout-no-panel:hidden!">
      <DockButton href={routes.grok} label="Grok">
        <GrokIcon className="h-[26px] w-[27px]" />
      </DockButton>
      <DockButton href={routes.chat} label="Chat">
        <ChatBubbleIcon className="size-[26px]" />
      </DockButton>
    </div>
  );
}
