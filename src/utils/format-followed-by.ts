import type { FollowedByPreview } from "@/types/user";

export function formatFollowedBy({ users, total }: FollowedByPreview) {
  const names = users.slice(0, 2).map((user) => user.displayName);
  if (total <= 0 || names.length === 0) return null;
  if (total === 1) return `Followed by ${names[0]}`;
  if (total === 2 && names.length === 2) {
    return `Followed by ${names[0]} and ${names[1]}`;
  }
  const others = total - names.length;
  return `Followed by ${names.join(", ")}, and ${others} ${
    others === 1 ? "other" : "others"
  } you follow`;
}
