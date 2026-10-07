import Link from "next/link";
import { ArrowUpRightIcon, ChevronRightIcon } from "@/components/ui/icons";
import type { SettingsLink } from "@/features/settings/types/settings";
import { cn } from "@/lib/utils";

export const settingsRowHover =
  "transition-colors duration-200 ease-[ease] hover:bg-menu-hover focus-visible:bg-menu-hover focus-visible:shadow-[inset_0_0_0_2px_var(--color-menu-focus-ring)] outline-none";

export function SettingsTrailingIcon({ external }: { external?: boolean }) {
  const Icon = external ? ArrowUpRightIcon : ChevronRightIcon;
  return <Icon className="ml-4 size-[18.75px] shrink-0 text-muted" />;
}

export function SettingsLinkRow({ link }: { link: SettingsLink }) {
  const { label, href, description, icon: Icon, external } = link;

  return (
    <Link
      href={href}
      role="tab"
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "flex items-center px-4 py-3",
        description && "min-h-[72px]",
        settingsRowHover,
      )}
    >
      {Icon ? (
        <span className="mr-4 flex w-12 shrink-0 justify-center">
          <Icon className="size-[18.75px] text-muted" />
        </span>
      ) : null}
      <span className="flex min-w-0 grow flex-col">
        <span className="text-base">{label}</span>
        {description ? (
          <span className="text-xs text-muted">{description}</span>
        ) : null}
      </span>
      <SettingsTrailingIcon external={external} />
    </Link>
  );
}
