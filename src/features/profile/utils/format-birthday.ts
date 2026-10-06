import type { User, Visibility } from "@/types/user";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function canSee(visibility: Visibility, profile: User, isViewer: boolean) {
  if (isViewer) return true;
  switch (visibility) {
    case "public":
      return true;
    case "followers":
      return profile.followedByViewer;
    case "following":
      return profile.followsViewer;
    case "mutual":
      return profile.followedByViewer && profile.followsViewer;
    case "self":
      return false;
  }
}

export function formatBirthday(profile: User, isViewer: boolean) {
  const { birthDate, birthDateVisibility } = profile;
  if (!birthDate) return null;

  const monthDay = canSee(birthDateVisibility.monthDay, profile, isViewer)
    ? `${MONTHS[birthDate.month - 1]} ${birthDate.day}`
    : null;
  const year = canSee(birthDateVisibility.year, profile, isViewer)
    ? String(birthDate.year)
    : null;

  if (monthDay && year) return `Born ${monthDay}, ${year}`;
  if (monthDay) return `Born ${monthDay}`;
  if (year) return `Born ${year}`;
  return null;
}
