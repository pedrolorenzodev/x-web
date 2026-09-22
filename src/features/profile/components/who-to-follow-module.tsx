import type { User } from "@/types/user";
import { UserCell } from "@/components/user/user-cell";

type WhoToFollowModuleProps = {
  users: User[];
  viewerId: string;
};

export function WhoToFollowModule({ users, viewerId }: WhoToFollowModuleProps) {
  return (
    <section className="border-b border-border pb-2">
      <h2 className="px-4 py-3 text-xl font-extrabold">Who to follow</h2>
      {users.map((user) => (
        <UserCell key={user.id} user={user} viewerId={viewerId} />
      ))}
      <button
        type="button"
        className="flex h-13 w-full items-center px-4 text-base text-accent transition-colors duration-200 ease-[ease] hover:bg-white/3"
      >
        Show more
      </button>
    </section>
  );
}
