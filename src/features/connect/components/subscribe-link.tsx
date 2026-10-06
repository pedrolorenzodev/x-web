import Link from "next/link";
import { routes } from "@/config/routes";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SubscribeLink({ handle }: { handle: string }) {
  return (
    <Link
      href={routes.profile(handle)}
      aria-label={`Subscribe to @${handle}`}
      className={cn(
        buttonStyles({ size: "sm" }),
        "relative shrink-0 duration-200 ease-[ease] hover:bg-inverted-hover",
      )}
    >
      Subscribe
    </Link>
  );
}
