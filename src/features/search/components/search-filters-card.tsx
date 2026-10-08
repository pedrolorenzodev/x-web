"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Radio } from "@/components/ui/radio";
import type { SearchFilterGroup } from "@/features/search/utils/search-tabs";

type SearchFiltersCardProps = {
  groups: SearchFilterGroup[];
  advancedHref: string;
};

export function SearchFiltersCard({
  groups,
  advancedHref,
}: SearchFiltersCardProps) {
  const router = useRouter();

  return (
    <>
      <section className="rounded-2xl border border-border px-4 py-3">
        <h2 className="text-xl font-extrabold">Search filters</h2>
      </section>
      <section className="rounded-2xl border border-border">
        <div className="flex flex-col gap-3 px-4 pt-3 pb-2">
          {groups.map((group) => (
            <fieldset key={group.label}>
              <legend className="mb-0.5 text-base font-bold">
                {group.label}
              </legend>
              {group.options.map((option) => (
                <Radio
                  key={option.label}
                  variant="compact"
                  name={group.label}
                  label={option.label}
                  checked={option.checked}
                  onChange={() => router.push(option.href)}
                />
              ))}
            </fieldset>
          ))}
        </div>
        <Link
          href={advancedHref}
          className="flex h-[52px] items-center rounded-b-2xl px-4 text-base text-accent transition-colors duration-200 ease-[ease] hover:bg-white/3"
        >
          Advanced search
        </Link>
      </section>
    </>
  );
}
