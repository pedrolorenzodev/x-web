"use client";

import Image from "next/image";
import { useState } from "react";
import { MAX_ALT_TEXT_LENGTH } from "@/config/compose";
import { Button } from "@/components/ui/button";
import { FloatingLabelTextarea } from "@/components/ui/floating-label-field";
import { CloseIcon } from "@/components/ui/icons";
import { Modal, ModalHeader } from "@/components/ui/modal";
import { Tooltip } from "@/components/ui/tooltip";
import type { ComposerMedia as Media } from "@/features/compose/types/composer";
import { cn } from "@/lib/utils";

const overlayButton =
  "flex items-center justify-center rounded-full bg-[rgb(15_20_25/0.75)] text-white backdrop-blur-[4px] transition-colors duration-200 ease-[ease] hover:bg-[rgb(39_44_48/0.75)]";

function MediaVisual({ media, sizes }: { media: Media; sizes: string }) {
  if (media.kind === "gif" && media.videoUrl) {
    return (
      <video
        src={media.videoUrl}
        poster={media.url}
        aria-label={media.alt}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 size-full object-cover"
      />
    );
  }
  return (
    <Image
      src={media.url}
      alt={media.alt}
      fill
      sizes={sizes}
      className="object-cover"
    />
  );
}

type ComposerMediaProps = {
  media: Media[];
  onRemove: (mediaId: string) => void;
  onAltChange: (mediaId: string, alt: string) => void;
};

export function ComposerMedia({
  media,
  onRemove,
  onAltChange,
}: ComposerMediaProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = media.find((item) => item.id === editingId) ?? null;
  const single = media.length === 1;

  return (
    <>
      <div
        className={cn(
          "mt-3 grid gap-3",
          single ? "grid-cols-1" : "grid-cols-2",
        )}
      >
        {media.map((item) => (
          <div
            key={item.id}
            style={
              single
                ? { aspectRatio: `${item.width} / ${item.height}` }
                : undefined
            }
            className={cn(
              "relative overflow-hidden rounded-2xl border border-border bg-black",
              single ? "max-h-[510px] w-full" : "aspect-square",
            )}
          >
            <MediaVisual media={item} sizes={single ? "516px" : "258px"} />
            <Tooltip label="Remove">
              <button
                type="button"
                aria-label="Remove media"
                onClick={() => onRemove(item.id)}
                className={cn(overlayButton, "absolute top-1 right-1 size-8")}
              >
                <CloseIcon className="size-[18px]" />
              </button>
            </Tooltip>
            {item.kind === "gif" ? (
              <span className="absolute bottom-3 left-3 rounded bg-black/77 px-1 text-xs font-bold text-white">
                GIF
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setEditingId(item.id)}
                className={cn(
                  overlayButton,
                  "absolute right-3 bottom-3 h-8 px-4 text-sm font-bold",
                )}
              >
                Edit
              </button>
            )}
          </div>
        ))}
      </div>

      {editing ? (
        <AltTextModal
          key={editing.id}
          media={editing}
          onClose={() => setEditingId(null)}
          onSave={(alt) => {
            onAltChange(editing.id, alt);
            setEditingId(null);
          }}
        />
      ) : null}
    </>
  );
}

type AltTextModalProps = {
  media: Media;
  onClose: () => void;
  onSave: (alt: string) => void;
};

function AltTextModal({ media, onClose, onSave }: AltTextModalProps) {
  const [alt, setAlt] = useState(media.alt);

  return (
    <Modal
      label="Edit media"
      size="fixed"
      onClose={onClose}
      restoreFocusOnUnmount
    >
      <ModalHeader
        onBack={onClose}
        title="Edit media"
        action={
          <Button size="sm" onClick={() => onSave(alt.trim())}>
            Save
          </Button>
        }
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="relative h-[320px] shrink-0 bg-black">
          <Image
            src={media.url}
            alt=""
            fill
            sizes="600px"
            className="object-contain"
          />
        </div>
        <div className="px-4 py-4">
          <FloatingLabelTextarea
            label="Description"
            value={alt}
            rows={4}
            maxLength={MAX_ALT_TEXT_LENGTH}
            autoFocus
            onChange={setAlt}
          />
          <p className="mt-3 text-sm text-muted">
            Descriptions help people who are blind or have low vision
            understand what&apos;s in an image.
          </p>
        </div>
      </div>
    </Modal>
  );
}
