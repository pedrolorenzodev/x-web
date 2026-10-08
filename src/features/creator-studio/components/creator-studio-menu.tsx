import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { ChevronRightIcon } from "@/components/ui/icons";
import {
  creatorStudioSections,
  type CreatorStudioBadge,
  type CreatorStudioRow,
} from "@/features/creator-studio/config/creator-studio";
import { cn } from "@/lib/utils";

const badges: Record<CreatorStudioBadge, { label: string; className: string }> =
  {
    ineligible: {
      label: "Ineligible",
      className: "bg-[rgb(38_38_38)] text-[rgb(115_115_115)]",
    },
    new: {
      label: "New",
      className: "bg-[rgb(30_27_75)] text-[rgb(14_165_233)]",
    },
  };

const rowClass =
  "flex min-h-14 items-center gap-3 py-2 pl-1 transition-colors duration-200 ease-[ease] hover:bg-white/3 focus-visible:bg-white/3 focus-visible:outline-none";

function RowContent({ row }: { row: CreatorStudioRow }) {
  const Icon = row.icon;
  const badge = row.badge ? badges[row.badge] : null;
  return (
    <>
      <span className="mr-1 flex size-10 shrink-0 items-center justify-center">
        <Icon className="size-6" />
      </span>
      <span className="flex min-w-0 grow flex-col">
        <span className="truncate text-base leading-[18px] font-medium text-white">
          {row.title}
        </span>
        {row.subtitle ? (
          <span className="mt-0.5 truncate text-sm leading-[21px] text-[rgb(115_115_115)]">
            {row.subtitle}
          </span>
        ) : null}
      </span>
      {badge ? (
        <span
          className={cn(
            "flex h-[22px] shrink-0 items-center rounded-full px-2 text-[12px] leading-[18px] font-medium",
            badge.className,
          )}
        >
          {badge.label}
        </span>
      ) : null}
      <ChevronRightIcon className="size-[18px] shrink-0 text-[rgb(82_82_82)]" />
    </>
  );
}

export function CreatorStudioMenu() {
  return (
    <>
      <PageHeader title="Creator Studio" align="center" size="compact" />
      <div className="flex flex-col gap-4 px-4 pt-3 pb-8">
        {creatorStudioSections.map((section) => (
          <section key={section.title} aria-label={section.title}>
            <h2 className="mb-2 px-1 text-base leading-[18px] font-bold text-white">
              {section.title}
            </h2>
            {section.rows.map((row) =>
              row.external ? (
                <a
                  key={row.title}
                  href={row.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={rowClass}
                >
                  <RowContent row={row} />
                </a>
              ) : (
                <Link key={row.title} href={row.href} className={rowClass}>
                  <RowContent row={row} />
                </Link>
              ),
            )}
          </section>
        ))}
      </div>
    </>
  );
}
