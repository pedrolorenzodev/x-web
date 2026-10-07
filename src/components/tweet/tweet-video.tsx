"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import type { TweetMedia } from "@/types/tweet";
import {
  ExitFullscreenIcon,
  FullscreenIcon,
  VideoPauseIcon,
  VideoPlayIcon,
  VolumeIcon,
  VolumeMutedIcon,
} from "@/components/ui/icons";
import { MediaBadge } from "@/components/tweet/media-badge";
import { formatDuration } from "@/utils/format-duration";
import { cn } from "@/lib/utils";

const VISIBLE_RATIO = 0.5;
const SEEK_STEP = 5;
const fade = "transition-opacity duration-200 ease-[ease]";

type TweetVideoProps = {
  media: TweetMedia;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
};

type ScrubberProps = {
  time: number;
  duration: number;
  onSeek: (time: number) => void;
};

function Scrubber({ time, duration, onSeek }: ScrubberProps) {
  const progress = duration > 0 ? Math.min(time / duration, 1) : 0;

  function seekAt(event: PointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(
      Math.max((event.clientX - box.left) / box.width, 0),
      1,
    );
    onSeek(ratio * duration);
  }

  function seekByKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight")
      onSeek(Math.min(time + SEEK_STEP, duration));
    else if (event.key === "ArrowLeft") onSeek(Math.max(time - SEEK_STEP, 0));
    else return;
    event.preventDefault();
  }

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Seek slider"
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(time)}
      aria-valuetext={`${formatDuration(time)} of ${formatDuration(duration)}`}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        seekAt(event);
      }}
      onPointerMove={(event) => {
        if (event.buttons === 1) seekAt(event);
      }}
      onKeyDown={seekByKey}
      className="group/scrubber flex h-5 cursor-pointer items-center outline-none"
    >
      <div className="relative h-1 w-full rounded-full bg-white/30">
        <div
          style={{ width: `${progress * 100}%` }}
          className="absolute inset-y-0 left-0 rounded-full bg-accent"
        />
        <div
          style={{ left: `${progress * 100}%` }}
          className="absolute top-1/2 size-3 -translate-1/2 scale-0 rounded-full bg-accent transition-transform duration-150 ease-[ease] group-hover/scrubber:scale-100 group-focus-visible/scrubber:scale-100"
        />
      </div>
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-9 items-center justify-center rounded-full text-white transition-colors duration-200 ease-[ease] hover:bg-white/10"
    >
      {children}
    </button>
  );
}

function PosterOnly({ media, className, style, sizes }: TweetVideoProps) {
  const badge = media.isGif
    ? "GIF"
    : media.durationMs
      ? formatDuration(media.durationMs / 1000)
      : null;

  return (
    <div
      style={style}
      className={cn("relative overflow-hidden bg-black", className)}
    >
      <Image
        src={media.url}
        alt={media.alt}
        fill
        sizes={sizes}
        className="object-contain"
      />
      {badge ? (
        <MediaBadge className="absolute bottom-3 left-3">{badge}</MediaBadge>
      ) : null}
    </div>
  );
}

export function TweetVideo(props: TweetVideoProps) {
  const { media, className, style } = props;
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pausedByUserRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState((media.durationMs ?? 0) / 1000);
  const [fullscreen, setFullscreen] = useState(false);
  const [failed, setFailed] = useState(false);
  const gif = Boolean(media.isGif);
  const playable = Boolean(media.videoUrl) && !failed;

  useEffect(() => {
    const frame = frameRef.current;
    const video = videoRef.current;
    if (!frame || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= VISIBLE_RATIO) {
          if (!pausedByUserRef.current) video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, VISIBLE_RATIO] },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [playable]);

  useEffect(() => {
    function syncFullscreen() {
      setFullscreen(document.fullscreenElement === frameRef.current);
    }
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () =>
      document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  if (!playable) return <PosterOnly {...props} />;

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      pausedByUserRef.current = false;
      video.play().catch(() => {});
    } else {
      pausedByUserRef.current = true;
      video.pause();
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (video) video.muted = !video.muted;
  }

  function seek(next: number) {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = next;
    setTime(next);
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else frameRef.current?.requestFullscreen();
  }

  const controlsPinned = started && !playing;
  const remaining = Math.max(duration - time, 0);
  const durationLabel = formatDuration(duration);

  return (
    <div
      ref={frameRef}
      style={style}
      className={cn("group/video relative overflow-hidden bg-black", className)}
    >
      <video
        ref={videoRef}
        src={media.videoUrl}
        poster={media.url}
        muted
        playsInline
        loop={gif}
        preload="none"
        aria-label={media.alt || (gif ? "Embedded GIF" : "Embedded video")}
        onPlay={() => {
          setPlaying(true);
          setStarted(true);
        }}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => {
          const value = event.currentTarget.duration;
          if (Number.isFinite(value)) setDuration(value);
        }}
        onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
        className="size-full object-contain"
      />

      <button
        type="button"
        aria-label={playing ? "Pause" : "Play"}
        onClick={togglePlay}
        className="absolute inset-0 cursor-pointer outline-none"
      />

      {!started && !gif ? (
        <button
          type="button"
          aria-label={`Play Video. ${Math.round(duration)} seconds long`}
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 flex size-[60px] -translate-1/2 items-center justify-center rounded-full border-4 border-white bg-accent text-white transition-colors duration-200 ease-[ease] hover:bg-accent/90"
        >
          <VideoPlayIcon className="ml-1 size-6" />
        </button>
      ) : null}

      <div
        className={cn(
          "pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between",
          fade,
          !gif && started && "group-hover/video:opacity-0",
          controlsPinned && "opacity-0",
        )}
      >
        <MediaBadge>
          {gif ? "GIF" : formatDuration(started ? remaining : duration)}
        </MediaBadge>
        {!gif && started ? (
          <button
            type="button"
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={toggleMute}
            className="pointer-events-auto flex size-8 items-center justify-center rounded-full bg-black/77 text-white"
          >
            {muted ? (
              <VolumeMutedIcon className="size-[18px]" />
            ) : (
              <VolumeIcon className="size-[18px]" />
            )}
          </button>
        ) : null}
      </div>

      {!gif && started ? (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-3 pt-6",
            fade,
            controlsPinned
              ? "opacity-100"
              : "opacity-0 group-focus-within/video:opacity-100 group-hover/video:opacity-100",
          )}
        >
          <Scrubber time={time} duration={duration} onSeek={seek} />
          <div className="flex h-10 items-center">
            <ControlButton
              label={playing ? "Pause" : "Play"}
              onClick={togglePlay}
            >
              {playing ? (
                <VideoPauseIcon className="size-5" />
              ) : (
                <VideoPlayIcon className="size-5" />
              )}
            </ControlButton>
            <span className="mr-1 ml-auto text-xs text-white tabular-nums">
              {formatDuration(time)} / {durationLabel}
            </span>
            <ControlButton
              label={muted ? "Unmute" : "Mute"}
              onClick={toggleMute}
            >
              {muted ? (
                <VolumeMutedIcon className="size-5" />
              ) : (
                <VolumeIcon className="size-5" />
              )}
            </ControlButton>
            <ControlButton
              label={fullscreen ? "Exit full screen" : "Full screen"}
              onClick={toggleFullscreen}
            >
              {fullscreen ? (
                <ExitFullscreenIcon className="size-5" />
              ) : (
                <FullscreenIcon className="size-5" />
              )}
            </ControlButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}
