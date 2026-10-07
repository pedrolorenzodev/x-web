"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { TweetMedia } from "@/types/tweet";
import {
  VideoPlayIcon,
  VolumeIcon,
  VolumeMutedIcon,
} from "@/components/ui/icons";
import { MediaBadge } from "@/components/tweet/media-badge";
import {
  TweetVideoControls,
  type VideoState,
} from "@/components/tweet/tweet-video-controls";
import { formatDuration } from "@/utils/format-duration";
import { cn } from "@/lib/utils";

const VISIBLE_RATIO = 0.5;
const fade = "transition-opacity duration-200 ease-[ease]";

type TweetVideoProps = {
  media: TweetMedia;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
};

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
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [state, setState] = useState<VideoState>({
    playing: false,
    muted: true,
    volume: 1,
    time: 0,
    duration: (media.durationMs ?? 0) / 1000,
    rate: 1,
    fullscreen: false,
  });
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
      const fullscreen = document.fullscreenElement === frameRef.current;
      setState((current) => ({ ...current, fullscreen }));
    }
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () =>
      document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  if (!playable) return <PosterOnly {...props} />;

  function update(change: Partial<VideoState>) {
    setState((current) => ({ ...current, ...change }));
  }

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

  const { playing, muted, time, duration } = state;
  const controlsPinned = started && !playing;
  const remaining = Math.max(duration - time, 0);

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
          update({ playing: true });
          setStarted(true);
        }}
        onPause={() => update({ playing: false })}
        onError={() => setFailed(true)}
        onTimeUpdate={(event) =>
          update({ time: event.currentTarget.currentTime })
        }
        onLoadedMetadata={(event) => {
          const value = event.currentTarget.duration;
          if (Number.isFinite(value)) update({ duration: value });
        }}
        onVolumeChange={(event) =>
          update({
            muted: event.currentTarget.muted,
            volume: event.currentTarget.volume,
          })
        }
        onRateChange={(event) =>
          update({ rate: event.currentTarget.playbackRate })
        }
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
          <VideoPlayIcon className="size-7" />
        </button>
      ) : null}

      <div
        className={cn(
          fade,
          !gif && started && "group-hover/video:opacity-0",
          controlsPinned && "opacity-0",
        )}
      >
        <MediaBadge className="absolute bottom-3 left-3">
          {gif ? "GIF" : formatDuration(started ? remaining : duration)}
        </MediaBadge>
        {!gif && started ? (
          <button
            type="button"
            data-testid="mute-button"
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={toggleMute}
            className="absolute right-1 bottom-0.5 flex size-10 items-center justify-center"
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-black/77 text-white">
              {muted ? (
                <VolumeMutedIcon className="size-3" />
              ) : (
                <VolumeIcon className="size-3" />
              )}
            </span>
          </button>
        ) : null}
      </div>

      {!gif && started ? (
        <TweetVideoControls
          state={state}
          videoRef={videoRef}
          frameRef={frameRef}
          onTogglePlay={togglePlay}
          className={cn(
            fade,
            controlsPinned
              ? "opacity-100"
              : "opacity-0 group-has-focus-visible/video:opacity-100 group-hover/video:opacity-100",
          )}
        />
      ) : null}
    </div>
  );
}
