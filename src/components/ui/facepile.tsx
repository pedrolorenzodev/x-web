import Image from "next/image";
import type { UserSummary } from "@/types/user";
import { cn } from "@/lib/utils";

type FacepileProps = {
  users: UserSummary[];
  size?: number;
  overlap?: number;
  className?: string;
};

export function Facepile({
  users,
  size = 22,
  overlap = 10,
  className,
}: FacepileProps) {
  return (
    <span className={cn("flex shrink-0", className)}>
      {users.map((user, index) => (
        <Image
          key={user.id}
          src={user.avatarUrl}
          alt=""
          width={size}
          height={size}
          style={{
            zIndex: users.length - index,
            width: size,
            height: size,
            marginLeft: index > 0 ? -overlap : 0,
          }}
          className="relative rounded-full object-cover ring-2 ring-background"
        />
      ))}
    </span>
  );
}
