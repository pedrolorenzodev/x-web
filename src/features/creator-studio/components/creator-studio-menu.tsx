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
      className: "bg-[rgb(38_38_38)] text-[rgb(163_163_163)]",
    },
    new: {
      label: "New",
      className: "bg-[rgb(30_27_75)] text-[rgb(56_189_248)]",
    },
  };

const rowClass =
  "mx-4 flex min-h-14 items-center gap-4 px-3 py-2 transition-colors duration-200 ease-[ease] hover:bg-white/3 focus-visible:bg-white/3 focus-visible:outline-none";

function RowContent({ row }: { row: CreatorStudioRow }) {
  const Icon = row.icon;
  const badge = row.badge ? badges[row.badge] : null;
  return (
    <>
      <Icon className="size-6 shrink-0" />
      <span className="flex min-w-0 grow flex-col">
        <span className="truncate text-base font-bold">{row.title}</span>
        {row.subtitle ? (
          <span className="truncate text-sm text-muted">{row.subtitle}</span>
        ) : null}
      </span>
      {badge ? (
        <span
          className={cn(
            "flex h-[22px] shrink-0 items-center rounded-full px-2 text-xs font-medium",
            badge.className,
          )}
        >
          {badge.label}
        </span>
      ) : null}
      <ChevronRightIcon className="size-[18px] shrink-0 text-[rgb(163_163_163)]" />
    </>
  );
}

export function CreatorStudioMenu() {
  return (
    <>
      <PageHeader title="Creator Studio" align="center" />
      <div className="pb-16">
        {creatorStudioSections.map((section) => (
          <section key={section.title} aria-label={section.title}>
            <h2 className="px-5 pt-2 pb-1 text-base font-bold">
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
