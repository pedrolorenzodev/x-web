import Link from "next/link";
import type { User } from "@/types/user";
import { routes } from "@/config/routes";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { card, heading, row } from "@/components/layout/right-panel/styles";

type RelevantPeopleProps = {
  people: User[];
  viewerId: string;
};

export function RelevantPeople({ people, viewerId }: RelevantPeopleProps) {
  return (
    <section className={card}>
      <h2 className={cn(heading, "pb-3")}>Relevant people</h2>
      <ul>
        {people.map((person) => (
          <li
            key={person.id}
            className={`relative flex gap-2 px-4 py-3 last:rounded-b-2xl ${row}`}
          >
            <Link
              href={routes.profile(person.handle)}
              aria-label={person.displayName}
              className="absolute inset-0"
            />
            <Avatar src={person.avatarUrl} alt={person.displayName} />
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center gap-2">
                <div className="flex min-w-0 flex-1 flex-col text-base">
                  <span className="truncate font-bold">
                    {person.displayName}
                  </span>
                  <span className="truncate text-muted">@{person.handle}</span>
                </div>
                {person.id === viewerId ? null : (
                  <Button
                    size="sm"
                    variant={person.followedByViewer ? "outline" : "primary"}
                    className="relative shrink-0"
                  >
                    {person.followedByViewer ? "Following" : "Follow"}
                  </Button>
                )}
              </div>
              {person.bio ? (
                <p className="mt-1 text-base break-words">{person.bio}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
