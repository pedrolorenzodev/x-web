"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  ArrowRightIcon,
  BackIcon,
  CloseIcon,
  DoubleChevronRightIcon,
} from "@/components/ui/icons";
import { ViewerButton } from "@/components/media-viewer/viewer-button";
import { useModalDialog } from "@/hooks/use-modal-dialog";
import {
  useRouteModalClose,
  type RouteModalDismiss,
} from "@/hooks/use-route-modal-close";
import { cn } from "@/lib/utils";

export type MediaViewerItem = {
  url: string;
  alt: string;
  width: number;
  height: number;
  maxWidth?: number;
  round?: boolean;
};

type MediaViewerProps = {
  items: MediaViewerItem[];
  hrefs: string[];
  index: number;
  dismiss: RouteModalDismiss;
  label: string;
  actions?: ReactNode;
  panel?: ReactNode;
};

const subscribeToNothing = () => () => {};

export function MediaViewer(props: MediaViewerProps) {
  const isClient = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  if (!isClient) return null;
  return createPortal(<MediaViewerContent {...props} />, document.body);
}

function isEditable(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT")
  );
}

function useBackgroundClick(onClick: () => void) {
  const pressedSelf = useRef(false);

  return {
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      pressedSelf.current = event.target === event.currentTarget;
    },
    onClick: (event: MouseEvent<HTMLElement>) => {
      if (pressedSelf.current && event.target === event.currentTarget) {
        onClick();
      }
    },
  };
}

function MediaViewerContent({
  items,
  hrefs,
  index: routeIndex,
  dismiss,
  label,
  actions,
  panel,
}: MediaViewerProps) {
  const close = useRouteModalClose(dismiss);
  const pathname = usePathname();
  const [index, setIndex] = useState(() => {
    const fromUrl = hrefs.indexOf(pathname);
    return fromUrl === -1 ? routeIndex : fromUrl;
  });
  const [panelOpen, setPanelOpen] = useState(true);
  const dialogRef = useRef<HTMLDivElement>(null);
  const stageClick = useBackgroundClick(close);
  const barClick = useBackgroundClick(close);

  useModalDialog(dialogRef, { onEscape: close });

  function show(next: number) {
    if (next < 0 || next >= items.length) return;
    setIndex(next);
    window.history.replaceState(null, "", hrefs[next]);
  }

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.defaultPrevented || isEditable(event.target)) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === "ArrowLeft") show(index - 1);
    else if (event.key === "ArrowRight") show(index + 1);
  });

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const item = items[index];
  const aspect = item.width / item.height;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal
      aria-label={label}
      tabIndex={-1}
      className="fixed inset-0 z-40 flex bg-black/90 outline-none"
    >
      <div className="relative flex min-w-0 flex-1 flex-col">
        <div
          {...stageClick}
          className="relative flex min-h-0 flex-1 items-center justify-center [container-type:size]"
        >
          <div
            key={item.url}
            style={{
              aspectRatio: aspect,
              width: item.maxWidth
                ? `min(100cqw, ${100 * aspect}cqh, ${item.maxWidth}px)`
                : `min(100cqw, ${100 * aspect}cqh)`,
            }}
            className={cn(
              "relative",
              item.round && "overflow-hidden rounded-full",
            )}
          >
            <Image
              src={item.url}
              alt={item.alt}
              fill
              sizes={item.maxWidth ? `${item.maxWidth}px` : "100vw"}
              preload
              className="object-contain"
            />
          </div>

          {index > 0 ? (
            <ViewerButton
              label="Previous slide"
              onClick={() => show(index - 1)}
              className="absolute top-1/2 left-3 -translate-y-1/2"
            >
              <BackIcon className="size-5" />
            </ViewerButton>
          ) : null}
          {index < items.length - 1 ? (
            <ViewerButton
              label="Next slide"
              onClick={() => show(index + 1)}
              className="absolute top-1/2 right-3 -translate-y-1/2"
            >
              <ArrowRightIcon className="size-5" />
            </ViewerButton>
          ) : null}
        </div>

        {actions ? (
          <div {...barClick} className="flex h-12 shrink-0 justify-center">
            <div className="flex w-full max-w-[568px] items-center px-3 text-white [&_.text-muted:not(:hover)]:text-white [&>[role=group]]:mt-0 [&>[role=group]]:w-full">
              {actions}
            </div>
          </div>
        ) : null}

        <ViewerButton
          label="Close"
          onClick={close}
          className="absolute top-3 left-3"
        >
          <CloseIcon className="size-5" />
        </ViewerButton>
        {panel ? (
          <ViewerButton
            label={panelOpen ? "Hide post" : "View post"}
            onClick={() => setPanelOpen((open) => !open)}
            className="absolute top-3 right-3"
          >
            <DoubleChevronRightIcon
              className={cn("size-5", !panelOpen && "-scale-x-100")}
            />
          </ViewerButton>
        ) : null}
      </div>

      {panel ? (
        <aside
          aria-label="Post"
          className={cn(
            "w-panel shrink-0 overflow-y-auto overscroll-contain border-l border-border bg-background",
            !panelOpen && "hidden",
          )}
        >
          {panel}
        </aside>
      ) : null}
    </div>
  );
}
