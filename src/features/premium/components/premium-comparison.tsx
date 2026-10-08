import { CheckIcon, CloseIcon, InfoIcon } from "@/components/ui/icons";
import {
  premiumComparison,
  type ComparisonValue,
} from "@/features/premium/config/premium";

function ComparisonCell({
  value,
  info,
}: {
  value: ComparisonValue;
  info: boolean;
}) {
  if (typeof value === "string") {
    return (
      <span className="flex items-center justify-center gap-2 text-center text-base">
        {value}
        {info ? <InfoIcon className="size-4 shrink-0 text-muted" /> : null}
      </span>
    );
  }
  return (
    <span className="flex justify-center">
      {value ? (
        <CheckIcon className="size-[18px]" />
      ) : (
        <CloseIcon className="size-[18px] text-muted" />
      )}
      <span className="sr-only">{value ? "Included" : "Not included"}</span>
    </span>
  );
}

const grid =
  "grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-3";

export function PremiumComparison() {
  return (
    <section aria-labelledby="premium-compare" className="mx-auto w-full max-w-[980px]">
      <h2 id="premium-compare" className="text-[23px] leading-7 font-medium">
        Compare tiers &amp; features
      </h2>
      <div className="mt-8 flex flex-col gap-8">
        {premiumComparison.map((section) => (
          <div
            key={section.title}
            className="rounded-2xl bg-menu-hover px-6 pb-3 max-[599px]:px-4"
          >
            <div className={`${grid} h-[60px] text-lg font-bold`}>
              <span>{section.title}</span>
              <span className="text-center">Premium</span>
              <span className="text-center">Premium+</span>
            </div>
            {section.rows.map((row) => (
              <div key={row.label} className={`${grid} min-h-[46px] py-1`}>
                <span className="flex items-center gap-2 text-base">
                  {row.label}
                  {row.info ? (
                    <InfoIcon className="size-4 shrink-0 text-muted" />
                  ) : null}
                </span>
                <ComparisonCell
                  value={row.premium}
                  info={Boolean(row.valueInfo)}
                />
                <ComparisonCell
                  value={row.premiumPlus}
                  info={Boolean(row.valueInfo)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
