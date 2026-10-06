import Link from "next/link";
import type { ToggleFollow, User } from "@/types/user";
import { UserCell } from "@/components/user/user-cell";

type PeopleModuleProps = {
  users: User[];
  viewAllHref: string;
  viewerId: string;
  toggleFollow: ToggleFollow;
};

export function PeopleModule({
  users,
  viewAllHref,
  viewerId,
  toggleFollow,
}: PeopleModuleProps) {
  return (
    <section className="border-b border-border">
      <h2 className="px-4 py-3 text-xl font-extrabold">People</h2>
      {users.map((user) => (
        <UserCell
          key={user.id}
          user={user}
          viewerId={viewerId}
          toggleFollow={toggleFollow}
        />
      ))}
      <Link
        href={viewAllHref}
        className="flex h-13 items-center px-4 text-base text-accent transition-colors duration-200 ease-[ease] hover:bg-white/3"
      >
        View all
      </Link>
    </section>
  );
}
