import type { ToggleFollow, User } from "@/types/user";
import { cn } from "@/lib/utils";
import { UserCell } from "@/components/user/user-cell";
import { card, heading } from "@/components/layout/right-panel/styles";

type RelevantPeopleProps = {
  people: User[];
  viewerId: string;
  toggleFollow: ToggleFollow;
};

export function RelevantPeople({
  people,
  viewerId,
  toggleFollow,
}: RelevantPeopleProps) {
  return (
    <section className={card}>
      <h2 className={cn(heading, "pb-3")}>Relevant people</h2>
      <ul>
        {people.map((person, index) => (
          <li key={person.id}>
            <UserCell
              user={person}
              viewerId={viewerId}
              toggleFollow={toggleFollow}
              className={cn(index === people.length - 1 && "rounded-b-2xl")}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
