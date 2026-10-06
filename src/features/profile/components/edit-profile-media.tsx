"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type ChangeEvent, type ReactNode } from "react";
import { routes } from "@/config/routes";
import {
  CameraPlusIcon,
  CloseIcon,
  ImageEditIcon,
} from "@/components/ui/icons";
import { showToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const AVATAR_PX = 400;
const BANNER_WIDTH_PX = 1500;
const BANNER_HEIGHT_PX = 500;
const JPEG_QUALITY = 0.85;
const ACCEPTED_IMAGES = "image/jpeg,image/png,image/webp";

async function readCroppedImage(file: File, width: number, height: number) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.max(width / bitmap.width, height / bitmap.height);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas
    .getContext("2d")
    ?.drawImage(
      bitmap,
      (bitmap.width - sourceWidth) / 2,
      (bitmap.height - sourceHeight) / 2,
      sourceWidth,
      sourceHeight,
      0,
      0,
      width,
      height,
    );
  bitmap.close();
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

function usePhotoPicker(
  width: number,
  height: number,
  onPick: (dataUrl: string) => void,
) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    try {
      onPick(await readCroppedImage(file, width, height));
    } catch {
      showToast({ message: "This file type isn’t supported." });
    }
  }

  return {
    open: () => inputRef.current?.click(),
    input: (
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGES}
        tabIndex={-1}
        data-testid="fileInput"
        onChange={onChange}
        className="hidden"
      />
    ),
  };
}

type PhotoButtonProps = {
  label: string;
  onClick: () => void;
  children: ReactNode;
};

function PhotoButton({ label, onClick, children }: PhotoButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-11 items-center justify-center rounded-full bg-inverted-foreground/75 text-white outline-none backdrop-blur-[4px] transition-colors duration-200 ease-[ease] hover:bg-media-control-hover/75 focus-visible:shadow-[0_0_0_2px_var(--color-menu-focus-ring)]"
    >
      {children}
    </button>
  );
}

type EditProfileMediaProps = {
  name: string;
  avatarUrl: string;
  bannerUrl: string | null;
  squareAvatar: boolean;
  onAvatarChange: (url: string) => void;
  onBannerChange: (url: string | null) => void;
};

export function EditProfileMedia({
  name,
  avatarUrl,
  bannerUrl,
  squareAvatar,
  onAvatarChange,
  onBannerChange,
}: EditProfileMediaProps) {
  const bannerPicker = usePhotoPicker(
    BANNER_WIDTH_PX,
    BANNER_HEIGHT_PX,
    onBannerChange,
  );
  const avatarPicker = usePhotoPicker(AVATAR_PX, AVATAR_PX, onAvatarChange);
  const avatarShape = squareAvatar ? "rounded-[8px]" : "rounded-full";

  return (
    <>
      <div className="relative aspect-[3/1] w-full">
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt=""
            fill
            sizes="600px"
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/30">
          <PhotoButton label="Add banner photo" onClick={bannerPicker.open}>
            <CameraPlusIcon className="size-[22px]" />
          </PhotoButton>
          {bannerUrl ? (
            <PhotoButton
              label="Remove photo"
              onClick={() => onBannerChange(null)}
            >
              <CloseIcon className="size-[22px]" />
            </PhotoButton>
          ) : null}
        </div>
        {bannerPicker.input}
      </div>

      <div className="relative flex h-[75px] pt-[11px] pr-[15px] pl-[151px]">
        <div
          className={cn(
            "absolute -top-[43px] left-4 bg-background p-[2px]",
            avatarShape,
          )}
        >
          <div className={cn("relative size-28 overflow-hidden", avatarShape)}>
            <Image
              src={avatarUrl}
              alt={name}
              width={112}
              height={112}
              className="size-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <PhotoButton label="Add avatar photo" onClick={avatarPicker.open}>
                <CameraPlusIcon className="size-[22px]" />
              </PhotoButton>
            </div>
          </div>
          {avatarPicker.input}
        </div>

        <div className="flex h-16 min-w-0 flex-1 items-center justify-between gap-3 rounded-lg bg-menu-hover p-3">
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-base font-bold">
              Edit your photo with Imagine
            </span>
            <span className="truncate text-sm text-muted">
              Customize yourself in seconds
            </span>
          </div>
          <Link
            href={routes.grok}
            className="flex h-9 shrink-0 items-center gap-1 rounded-full border border-border-strong bg-border-strong px-4 text-base font-bold transition-[filter] duration-200 ease-[ease] hover:brightness-125"
          >
            <ImageEditIcon className="size-5" />
            Edit Photo
          </Link>
        </div>
      </div>
    </>
  );
}
