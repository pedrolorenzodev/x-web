"use client";

import {
  useRef,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import {
  DropdownMenu,
  MenuItem,
  type MenuPlacement,
} from "@/components/ui/dropdown-menu";
import {
  ExitFullscreenIcon,
  FullscreenIcon,
  PictureInPictureIcon,
  VideoPauseIcon,
  VideoPlayIcon,
  VideoSettingsIcon,
  VolumeIcon,
  VolumeMutedIcon,
} from "@/components/ui/icons";
import { useDropdownMenu } from "@/hooks/use-dropdown-menu";
import { formatDuration } from "@/utils/format-duration";
import { cn } from "@/lib/utils";

const SEEK_STEP = 5;
const VOLUME_STEP = 0.1;
const MENU_GAP = 4;
const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

export type VideoState = {
  playing: boolean;
  muted: boolean;
  volume: number;
  time: number;
  duration: number;
  rate: number;
  fullscreen: boolean;
};

type Axis = "x" | "y";

function ratioAt(event: PointerEvent<HTMLElement>, axis: Axis) {
  const box = event.currentTarget.getBoundingClientRect();
  const raw =
    axis === "x"
      ? (event.clientX - box.left) / box.width
      : (box.bottom - event.clientY) / box.height;
  return Math.min(Math.max(raw, 0), 1);
}

function dragHandlers(axis: Axis, onRatio: (ratio: number) => void) {
  return {
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      onRatio(ratioAt(event, axis));
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      if (event.buttons === 1) onRatio(ratioAt(event, axis));
    },
  };
}

function stepHandler(
  increase: string,
  decrease: string,
  onStep: (direction: 1 | -1) => void,
) {
  return (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === increase) onStep(1);
    else if (event.key === decrease) onStep(-1);
    else return;
    event.preventDefault();
  };
}

const knob =
  "absolute size-4 rounded-full bg-white shadow-[0_0_7px_rgb(101_119_134/0.2),0_1px_3px_1px_rgb(101_119_134/0.15)] transition-transform duration-100 ease-[ease]";

type ScrubberProps = {
  time: number;
  duration: number;
  onSeek: (time: number) => void;
};

function Scrubber({ time, duration, onSeek }: ScrubberProps) {
  const progress = duration > 0 ? Math.min(time / duration, 1) * 100 : 0;

  return (
    <div
      data-testid="scrubber"
      role="slider"
      tabIndex={0}
      aria-label="Seek slider"
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(time)}
      aria-valuetext={`${formatDuration(time)} of ${formatDuration(duration)}`}
      {...dragHandlers("x", (ratio) => onSeek(ratio * duration))}
      onKeyDown={stepHandler("ArrowRight", "ArrowLeft", (direction) =>
        onSeek(Math.min(Math.max(time + direction * SEEK_STEP, 0), duration)),
      )}
      className="group/scrubber absolute inset-x-1 bottom-[42px] flex h-5 cursor-pointer items-center px-1 outline-none"
    >
      <div className="relative h-0.5 w-full rounded-lg bg-white/33 transition-[height] duration-100 ease-[ease] group-hover/scrubber:h-1 group-focus-visible/scrubber:h-1">
        <div
          style={{ width: `${progress}%` }}
          className="absolute inset-y-0 left-0 rounded-lg bg-white"
        />
        <div
          style={{ left: `${progress}%` }}
          className={cn(
            knob,
            "top-1/2 -translate-1/2 scale-0 group-hover/scrubber:scale-100 group-focus-visible/scrubber:scale-100",
          )}
        />
      </div>
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full text-white outline-none transition-[background-color,box-shadow] duration-200 ease-[ease] hover:bg-white/10 focus-visible:bg-white/10",
        className,
      )}
    >
      {children}
    </button>
  );
}

type VolumeControlProps = {
  muted: boolean;
  volume: number;
  onToggleMute: () => void;
  onVolume: (volume: number) => void;
};

function VolumeControl({
  muted,
  volume,
  onToggleMute,
  onVolume,
}: VolumeControlProps) {
  const level = muted ? 0 : volume;

  return (
    <div className="group/volume relative">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 rounded-full bg-white/10 opacity-0 transition-opacity duration-200 ease-[ease] group-focus-within/volume:opacity-100 group-hover/volume:opacity-100" />
      <div className="invisible absolute bottom-[52px] left-1/2 -translate-x-1/2 group-focus-within/volume:visible group-hover/volume:visible">
        <div
          role="slider"
          tabIndex={0}
          aria-label="Volume slider"
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(level * 100)}
          {...dragHandlers("y", onVolume)}
          onKeyDown={stepHandler("ArrowUp", "ArrowDown", (direction) =>
            onVolume(Math.min(Math.max(level + direction * VOLUME_STEP, 0), 1)),
          )}
          className="relative flex h-24 w-5 cursor-pointer justify-center outline-none"
        >
          <div className="relative h-full w-1 rounded-lg bg-white/33">
            <div
              style={{ height: `${level * 100}%` }}
              className="absolute inset-x-0 bottom-0 rounded-lg bg-white"
            />
            <div
              style={{ bottom: `${level * 100}%` }}
              className={cn(knob, "left-1/2 -translate-x-1/2 translate-y-1/2")}
            />
          </div>
        </div>
      </div>
      <ControlButton
        label={muted ? "Unmute" : "Mute"}
        onClick={onToggleMute}
        className="relative hover:bg-transparent"
      >
        {muted ? (
          <VolumeMutedIcon className="size-5" />
        ) : (
          <VolumeIcon className="size-5" />
        )}
      </ControlButton>
    </div>
  );
}

function placeAboveRight(anchor: DOMRect): MenuPlacement {
  return {
    style: {
      right: window.innerWidth - anchor.right,
      bottom: window.innerHeight - anchor.top + MENU_GAP,
    },
    origin: "bottom-right",
  };
}

function SettingsMenu({
  rate,
  onRate,
}: {
  rate: number;
  onRate: (rate: number) => void;
}) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menu = useDropdownMenu(anchorRef, placeAboveRight);

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        aria-label="Video Settings"
        aria-haspopup="menu"
        aria-expanded={menu.isOpen}
        onClick={menu.toggle}
        className="flex size-9 shrink-0 items-center justify-center rounded-full text-white outline-none transition-[background-color,box-shadow] duration-200 ease-[ease] hover:bg-white/10 focus-visible:bg-white/10"
      >
        <VideoSettingsIcon className="size-5" />
      </button>
      {menu.placement ? (
        <DropdownMenu
          menu={menu}
          label="Playback speed"
          style={menu.placement.style}
          origin={menu.placement.origin}
          className="w-[200px]"
        >
          <p className="px-4 pb-1 text-sm font-bold text-muted">
            Playback speed
          </p>
          {playbackRates.map((option) => (
            <MenuItem
              key={option}
              label={option === 1 ? "Normal" : `${option}x`}
              checked={option === rate}
              onSelect={(event) => {
                menu.selectItem(event);
                onRate(option);
              }}
            />
          ))}
        </DropdownMenu>
      ) : null}
    </>
  );
}

type TweetVideoControlsProps = {
  state: VideoState;
  videoRef: RefObject<HTMLVideoElement | null>;
  frameRef: RefObject<HTMLDivElement | null>;
  onTogglePlay: () => void;
  className?: string;
};

export function TweetVideoControls({
  state,
  videoRef,
  frameRef,
  onTogglePlay,
  className,
}: TweetVideoControlsProps) {
  const { playing, muted, volume, time, duration, rate, fullscreen } = state;

  function withVideo(action: (video: HTMLVideoElement) => void) {
    const video = videoRef.current;
    if (video) action(video);
  }

  function setVolume(next: number) {
    withVideo((video) => {
      video.volume = next;
      video.muted = next === 0;
    });
  }

  function togglePictureInPicture() {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(() => {});
      return;
    }
    withVideo((video) => {
      video.requestPictureInPicture().catch(() => {});
    });
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else frameRef.current?.requestFullscreen().catch(() => {});
  }

  return (
    <div className={cn("absolute inset-x-0 bottom-0 h-[62px]", className)}>
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/77" />
      <Scrubber
        time={time}
        duration={duration}
        onSeek={(next) =>
          withVideo((video) => {
            video.currentTime = next;
          })
        }
      />
      <div className="absolute inset-x-1 bottom-1 flex h-9 items-center">
        <ControlButton label={playing ? "Pause" : "Play"} onClick={onTogglePlay}>
          {playing ? (
            <VideoPauseIcon className="size-5" />
          ) : (
            <VideoPlayIcon className="size-5" />
          )}
        </ControlButton>
        <span className="mr-[5px] ml-auto text-[15px] leading-5 text-white">
          {formatDuration(time)} / {formatDuration(duration)}
        </span>
        <VolumeControl
          muted={muted}
          volume={volume}
          onToggleMute={() =>
            withVideo((video) => {
              video.muted = !video.muted;
              if (!video.muted && video.volume === 0) video.volume = 1;
            })
          }
          onVolume={setVolume}
        />
        <SettingsMenu
          rate={rate}
          onRate={(next) =>
            withVideo((video) => {
              video.playbackRate = next;
            })
          }
        />
        <ControlButton
          label="Picture-in-Picture"
          onClick={togglePictureInPicture}
        >
          <PictureInPictureIcon className="size-5" />
        </ControlButton>
        <ControlButton
          label={fullscreen ? "Exit full screen" : "Full screen"}
          onClick={toggleFullscreen}
        >
          {fullscreen ? (
            <ExitFullscreenIcon className="size-[18.75px]" />
          ) : (
            <FullscreenIcon className="size-[18.75px]" />
          )}
        </ControlButton>
      </div>
    </div>
  );
}
