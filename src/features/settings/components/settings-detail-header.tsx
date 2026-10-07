import Link from "next/link";
import { BackIcon } from "@/components/ui/icons";

type SettingsDetailHeaderProps = {
  title: string;
  backHref?: string;
};

export function SettingsDetailHeader({ title, backHref }: SettingsDetailHeaderProps) {
  return (
    <div className="sticky top-0 z-3 flex h-[53px] items-center bg-background/65 px-4 backdrop-blur-[12px]">
      {backHref ? (
        <div className="min-w-14">
          <Link
            href={backHref}
            aria-label="Back"
            className="-ml-2 flex size-9 items-center justify-center rounded-full text-inverted transition-colors duration-200 ease-[ease] hover:bg-inverted/10"
          >
            <BackIcon className="size-5" />
          </Link>
        </div>
      ) : null}
      <h2 className="truncate py-0.5 text-xl font-bold">{title}</h2>
    </div>
  );
}
