"use server";

import { refresh } from "next/cache";
import type {
  BirthDate,
  BirthDateVisibility,
  UserWebsite,
  Visibility,
} from "@/types/user";
import { getMockViewer } from "@/mocks/session";
import { PROFILE_LIMITS } from "@/features/profile/utils/profile-limits";

export type ProfileUpdate = {
  displayName: string;
  bio: string;
  location: string;
  website: string;
  birthDate: BirthDate | null;
  birthDateVisibility: BirthDateVisibility;
  avatarUrl: string;
  bannerUrl: string | null;
};

export type ProfileUpdateResult = { error: string } | null;

const MAX_IMAGE_DATA_URL = 900_000;
const IMAGE_DATA_URL = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;

function isValidBirthDate({ year, month, day }: BirthDate) {
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    Number.isInteger(year) &&
    year >= 1900 &&
    year <= new Date().getUTCFullYear() &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

const VISIBILITIES: readonly Visibility[] = [
  "public",
  "followers",
  "following",
  "mutual",
  "self",
];

function isValidVisibility({ monthDay, year }: BirthDateVisibility) {
  return VISIBILITIES.includes(monthDay) && VISIBILITIES.includes(year);
}

function acceptsImage(next: string, current: string | null) {
  return (
    next === current ||
    (next.length <= MAX_IMAGE_DATA_URL && IMAGE_DATA_URL.test(next))
  );
}

function toWebsite(input: string): UserWebsite | null {
  if (input === "") return null;
  const url = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  try {
    const parsed = new URL(url);
    const display = `${parsed.host}${parsed.pathname === "/" ? "" : parsed.pathname}`;
    return { url, display };
  } catch {
    return null;
  }
}

export async function updateProfile(
  update: ProfileUpdate,
): Promise<ProfileUpdateResult> {
  const viewer = await getMockViewer();
  if (!viewer) return { error: "Your session has expired." };

  const displayName = update.displayName.trim();
  const bio = update.bio.trim();
  const location = update.location.trim();
  const websiteInput = update.website.trim();

  if (displayName === "") return { error: "Name can’t be blank" };
  if (
    displayName.length > PROFILE_LIMITS.displayName ||
    bio.length > PROFILE_LIMITS.bio ||
    location.length > PROFILE_LIMITS.location ||
    websiteInput.length > PROFILE_LIMITS.website
  ) {
    return { error: "Something went wrong. Try again." };
  }

  const website = toWebsite(websiteInput);
  if (websiteInput !== "" && !website) return { error: "Invalid website" };
  if (update.birthDate && !isValidBirthDate(update.birthDate)) {
    return { error: "Invalid birth date" };
  }
  if (!isValidVisibility(update.birthDateVisibility)) {
    return { error: "Something went wrong. Try again." };
  }
  if (
    !acceptsImage(update.avatarUrl, viewer.avatarUrl) ||
    (update.bannerUrl !== null &&
      !acceptsImage(update.bannerUrl, viewer.bannerUrl))
  ) {
    return { error: "This image couldn’t be uploaded." };
  }

  viewer.displayName = displayName;
  viewer.bio = bio;
  viewer.location = location === "" ? null : location;
  viewer.website = website;
  viewer.birthDate = update.birthDate;
  viewer.birthDateVisibility = update.birthDateVisibility;
  viewer.avatarUrl = update.avatarUrl;
  viewer.bannerUrl = update.bannerUrl;

  refresh();
  return null;
}
