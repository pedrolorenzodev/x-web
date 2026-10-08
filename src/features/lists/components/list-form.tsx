"use client";

import Image from "next/image";
import { useRef } from "react";
import { CameraPlusIcon, CloseIcon } from "@/components/ui/icons";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FloatingLabelInput,
  FloatingLabelTextarea,
} from "@/components/ui/floating-label-field";
import { Tooltip } from "@/components/ui/tooltip";
import { ListBanner } from "@/components/list/list-cover";
import {
  LIST_DESCRIPTION_MAX,
  LIST_NAME_MAX,
  type ListDraft,
} from "@/features/lists/types/list-draft";
import { readCoverImage } from "@/features/lists/utils/read-cover-image";

type ListFormProps = {
  draft: ListDraft;
  listId?: string;
  onChange: (draft: ListDraft) => void;
};

const coverButton =
  "flex size-11 items-center justify-center rounded-full bg-[rgb(15_20_25/0.75)] text-white backdrop-blur-[4px] transition-colors duration-200 ease-[ease] hover:bg-[rgb(39_44_48/0.75)] focus-visible:shadow-[0_0_0_2px_var(--color-accent)] outline-none";

export function ListForm({ draft, listId, onChange }: ListFormProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const update = (patch: Partial<ListDraft>) => onChange({ ...draft, ...patch });

  async function pickCover(file: File | undefined) {
    if (!file) return;
    try {
      update({ bannerUrl: await readCoverImage(file) });
    } catch {
      update({ bannerUrl: null });
    }
  }

  return (
    <>
      <div className="relative m-0.5 aspect-[3/1] overflow-hidden bg-border-strong">
        {draft.bannerUrl ? (
          <Image
            src={draft.bannerUrl}
            alt=""
            fill
            sizes="600px"
            className="object-cover"
          />
        ) : listId ? (
          <ListBanner listId={listId} bannerUrl={null} />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center gap-5 bg-black/30">
          <Tooltip label="Add banner photo">
            <button
              type="button"
              aria-label="Add banner photo"
              onClick={() => fileRef.current?.click()}
              className={coverButton}
            >
              <CameraPlusIcon className="size-[22px]" />
            </button>
          </Tooltip>
          {draft.bannerUrl ? (
            <Tooltip label="Remove photo">
              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => update({ bannerUrl: null })}
                className={coverButton}
              >
                <CloseIcon className="size-[22px]" />
              </button>
            </Tooltip>
          ) : null}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          tabIndex={-1}
          className="hidden"
          onChange={(event) => {
            pickCover(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>
      <div className="flex flex-col gap-7 px-4 pt-3 pb-4">
        <FloatingLabelInput
          label="Name"
          name="name"
          autoComplete="off"
          value={draft.name}
          maxLength={LIST_NAME_MAX}
          onChange={(name) => update({ name })}
        />
        <FloatingLabelTextarea
          label="Description"
          name="description"
          value={draft.description}
          maxLength={LIST_DESCRIPTION_MAX}
          onChange={(description) => update({ description })}
        />
      </div>
      <label className="flex cursor-pointer items-start justify-between gap-4 p-4">
        <span className="flex flex-col">
          <span className="text-base">Make private</span>
          <span className="mt-1 text-xs leading-4 text-muted">
            When you make a List private, only you can see it.
          </span>
        </span>
        <Checkbox
          name="private"
          checked={draft.private}
          onChange={(event) => update({ private: event.target.checked })}
          className="-my-2 -mr-2"
        />
      </label>
    </>
  );
}
