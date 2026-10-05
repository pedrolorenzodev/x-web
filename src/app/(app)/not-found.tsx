import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

export default function AppNotFound() {
  return (
    <div className="flex flex-col items-center px-8 pt-[148px] text-center">
      <p className="text-base text-muted">
        Hmm...this page doesn’t exist. Try searching for something else.
      </p>
      <Link
        href="/explore"
        className={`${buttonStyles({ variant: "accent", size: "md" })} mt-7`}
      >
        Search
      </Link>
    </div>
  );
}
