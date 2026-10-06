"use client";

import Link from "next/link";
import { useId, useState, useTransition } from "react";
import type { User } from "@/types/user";
import { routes } from "@/config/routes";
import { ConfirmSheet } from "@/components/ui/confirm-sheet";
import {
  FloatingLabelInput,
  FloatingLabelTextarea,
} from "@/components/ui/floating-label-field";
import { ChevronRightIcon } from "@/components/ui/icons";
import { Modal, ModalHeader } from "@/components/ui/modal";
import { showToast } from "@/components/ui/toast";
import {
  useRouteModalClose,
  type RouteModalDismiss,
} from "@/hooks/use-route-modal-close";
import { cn } from "@/lib/utils";
import {
  updateProfile,
  type ProfileUpdate,
} from "@/features/profile/api/update-profile";
import {
  EditProfileBirthDateEditor,
  EditProfileBirthDateRow,
  type BirthDateParts,
} from "@/features/profile/components/edit-profile-birth-date";
import { EditProfileMedia } from "@/features/profile/components/edit-profile-media";
import { PROFILE_LIMITS } from "@/features/profile/utils/profile-limits";

type ProfileDraft = Omit<ProfileUpdate, "birthDate"> & {
  birthDate: BirthDateParts;
};

type OpenSheet = "discard" | "birth-date" | null;

const EMPTY_BIRTH_DATE: BirthDateParts = { month: "", day: "", year: "" };

function toDraft(profile: User): ProfileDraft {
  const { birthDate } = profile;
  return {
    displayName: profile.displayName,
    bio: profile.bio,
    location: profile.location ?? "",
    website: profile.website?.url ?? "",
    avatarUrl: profile.avatarUrl,
    bannerUrl: profile.bannerUrl,
    birthDate: birthDate
      ? {
          month: String(birthDate.month),
          day: String(birthDate.day),
          year: String(birthDate.year),
        }
      : EMPTY_BIRTH_DATE,
  };
}

function toUpdate({ birthDate, ...draft }: ProfileDraft): ProfileUpdate {
  const complete =
    birthDate.month !== "" && birthDate.day !== "" && birthDate.year !== "";
  return {
    ...draft,
    birthDate: complete
      ? {
          year: Number(birthDate.year),
          month: Number(birthDate.month),
          day: Number(birthDate.day),
        }
      : null,
  };
}

function isBirthDatePartial({ month, day, year }: BirthDateParts) {
  const filled = [month, day, year].filter((part) => part !== "").length;
  return filled > 0 && filled < 3;
}

function sameDraft(a: ProfileDraft, b: ProfileDraft) {
  return (
    a.displayName === b.displayName &&
    a.bio === b.bio &&
    a.location === b.location &&
    a.website === b.website &&
    a.avatarUrl === b.avatarUrl &&
    a.bannerUrl === b.bannerUrl &&
    a.birthDate.month === b.birthDate.month &&
    a.birthDate.day === b.birthDate.day &&
    a.birthDate.year === b.birthDate.year
  );
}

type EditProfileModalProps = {
  profile: User;
  dismiss: RouteModalDismiss;
};

export function EditProfileModal({ profile, dismiss }: EditProfileModalProps) {
  const close = useRouteModalClose(dismiss);
  const titleId = useId();
  const [initial] = useState(() => toDraft(profile));
  const [draft, setDraft] = useState(initial);
  const [editingBirthDate, setEditingBirthDate] = useState(false);
  const [sheet, setSheet] = useState<OpenSheet>(null);
  const [pending, startTransition] = useTransition();

  const nameError =
    draft.displayName.trim() === "" ? "Name can’t be blank" : undefined;
  const invalid = Boolean(nameError) || isBirthDatePartial(draft.birthDate);
  const dirty = !sameDraft(draft, initial);

  function update<Key extends keyof ProfileDraft>(
    key: Key,
    value: ProfileDraft[Key],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function requestClose() {
    if (sheet) {
      setSheet(null);
      return;
    }
    if (pending) return;
    if (dirty) setSheet("discard");
    else close();
  }

  function save() {
    if (invalid || pending) return;
    if (!dirty) {
      close();
      return;
    }
    startTransition(async () => {
      const result = await updateProfile(toUpdate(draft));
      if (result) showToast({ message: result.error });
      else close();
    });
  }

  return (
    <Modal
      labelledBy={titleId}
      size="fixed"
      onClose={requestClose}
      className="bg-elevated"
    >
      <ModalHeader
        onClose={requestClose}
        title="Edit profile"
        titleId={titleId}
        className="bg-elevated/85"
        action={
          <button
            type="button"
            aria-disabled={invalid || pending || undefined}
            onClick={save}
            className={cn(
              "flex h-8 items-center rounded-full bg-inverted px-4 text-sm font-bold text-inverted-foreground outline-none",
              "transition-[background-color,box-shadow] duration-200 ease-[ease] focus-visible:shadow-[0_0_0_2px_var(--color-button-focus-ring)]",
              invalid || pending
                ? "cursor-default opacity-50"
                : "hover:bg-inverted-hover active:bg-inverted-pressed",
            )}
          >
            Save
          </button>
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-16">
        <EditProfileMedia
          name={draft.displayName}
          avatarUrl={draft.avatarUrl}
          bannerUrl={draft.bannerUrl}
          squareAvatar={profile.verified === "business"}
          onAvatarChange={(url) => update("avatarUrl", url)}
          onBannerChange={(url) => update("bannerUrl", url)}
        />

        <div className="flex flex-col gap-7 px-4 pt-3">
          <FloatingLabelInput
            label="Name"
            name="displayName"
            value={draft.displayName}
            onChange={(value) => update("displayName", value)}
            maxLength={PROFILE_LIMITS.displayName}
            error={nameError}
            autoComplete="name"
          />
          <FloatingLabelTextarea
            label="Bio"
            name="description"
            value={draft.bio}
            onChange={(value) => update("bio", value)}
            maxLength={PROFILE_LIMITS.bio}
          />
          <FloatingLabelInput
            label="Location"
            name="location"
            value={draft.location}
            onChange={(value) => update("location", value)}
            maxLength={PROFILE_LIMITS.location}
          />
          <FloatingLabelInput
            label="Website"
            name="url"
            type="url"
            value={draft.website}
            onChange={(value) => update("website", value)}
            maxLength={PROFILE_LIMITS.website}
            autoComplete="url"
          />
        </div>

        {editingBirthDate ? (
          <EditProfileBirthDateEditor
            value={draft.birthDate}
            onChange={(value) => update("birthDate", value)}
            onCancel={() => {
              update("birthDate", initial.birthDate);
              setEditingBirthDate(false);
            }}
            onRemove={() => {
              update("birthDate", EMPTY_BIRTH_DATE);
              setEditingBirthDate(false);
            }}
          />
        ) : (
          <EditProfileBirthDateRow
            value={draft.birthDate}
            onEdit={() => setSheet("birth-date")}
          />
        )}

        <Link
          href={routes.settings}
          className="flex h-12 items-center px-4 transition-colors duration-200 ease-[ease] outline-none hover:bg-foreground/[0.03] focus-visible:bg-foreground/[0.03]"
        >
          <span className="min-w-0 flex-1 truncate text-xl font-normal">
            Switch to professional
          </span>
          <ChevronRightIcon className="box-content size-[18.75px] shrink-0 pl-3 text-muted" />
        </Link>
      </div>

      {sheet === "birth-date" ? (
        <ConfirmSheet
          title="Edit date of birth?"
          body="This can only be changed a few times. Make sure you enter the age of the person using the account."
          confirmLabel="Edit"
          onConfirm={() => {
            setSheet(null);
            setEditingBirthDate(true);
          }}
          onCancel={() => setSheet(null)}
        />
      ) : null}
      {sheet === "discard" ? (
        <ConfirmSheet
          title="Discard changes?"
          body="This can’t be undone and you’ll lose your changes."
          confirmLabel="Discard"
          tone="danger"
          onConfirm={close}
          onCancel={() => setSheet(null)}
        />
      ) : null}
    </Modal>
  );
}
