import { InfoIcon } from "@/components/ui/icons";
import type {
  BillingPeriod,
  PremiumPlan,
} from "@/features/premium/config/premium";
import { cn } from "@/lib/utils";

type PremiumPlanCardProps = {
  plan: PremiumPlan;
  period: BillingPeriod;
  selected: boolean;
  onSelect: () => void;
};

export function PremiumPlanCard({
  plan,
  period,
  selected,
  onSelect,
}: PremiumPlanCardProps) {
  const price = plan.prices[period];

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={plan.name}
      onClick={onSelect}
      className={cn(
        "flex w-[360px] max-w-full flex-col rounded-[20px] border-2 bg-menu-hover p-5 text-left outline-none transition-[border-color,box-shadow] duration-200 ease-[ease] focus-visible:shadow-[0_0_0_2px_var(--color-menu-focus-ring)]",
        selected
          ? "border-accent shadow-[0_0_25px_rgb(101_119_134/0.2),0_0_3px_1px_rgb(101_119_134/0.15)]"
          : "border-transparent",
      )}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="text-xl font-medium">{plan.name}</span>
        {period === "monthly" ? (
          <span className="text-sm font-medium text-accent">{plan.promo}</span>
        ) : null}
      </span>
      <span className="mt-2 flex items-baseline gap-1">
        <span className="text-[32px] leading-10 font-normal">
          {price.amount}
        </span>
        <span className="text-base text-muted">{price.unit}</span>
      </span>
      {price.detail ? (
        <span className="text-base text-muted">{price.detail}</span>
      ) : null}
      <ul className="mt-4 flex flex-col gap-3">
        {plan.features.map((feature) => {
          const Icon = feature.icon;
          return (
            <li key={feature.label} className="flex items-center gap-2">
              <Icon className="size-[21px] shrink-0" />
              <span className="text-base">{feature.label}</span>
              {feature.isNew ? (
                <span className="rounded bg-[rgb(54_54_57)] px-1 py-0.5 text-[11px] leading-3 font-medium">
                  NEW
                </span>
              ) : null}
              {feature.info ? (
                <InfoIcon className="ml-auto size-4 shrink-0 text-muted" />
              ) : null}
            </li>
          );
        })}
      </ul>
    </button>
  );
}
