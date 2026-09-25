import { HANDLE_MAX_LENGTH, HANDLE_MIN_LENGTH } from "@/config/auth";

const FALLBACK_STEM = "user";
const SUFFIX_DIGITS = [4, 4, 5, 6, 7];

function randomDigits(length: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

export function handleCandidates(displayName: string) {
  const stem =
    displayName
      .normalize("NFKD")
      .replace(/[^A-Za-z0-9_]/g, "")
      .slice(0, HANDLE_MAX_LENGTH) || FALLBACK_STEM;
  const withSuffixes = SUFFIX_DIGITS.map((digits) => {
    const suffix = randomDigits(digits);
    return stem.slice(0, HANDLE_MAX_LENGTH - suffix.length) + suffix;
  });
  return stem.length >= HANDLE_MIN_LENGTH ? [stem, ...withSuffixes] : withSuffixes;
}
