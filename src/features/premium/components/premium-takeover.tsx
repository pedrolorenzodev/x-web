"use client";

import Image from "next/image";
import { useState } from "react";
import { CloseIcon } from "@/components/ui/icons";
import { Modal } from "@/components/ui/modal";
import { showToast } from "@/components/ui/toast";
import {
  useRouteModalClose,
  type RouteModalDismiss,
} from "@/hooks/use-route-modal-close";
import {
  premiumBusiness,
  premiumHeadline,
  premiumLegalLinks,
  premiumPlans,
  premiumUnavailableMessage,
  type BillingPeriod,
  type PremiumPlanId,
} from "@/features/premium/config/premium";
import { PremiumHero } from "@/features/premium/components/premium-hero";
import { PremiumPlanCard } from "@/features/premium/components/premium-plan-card";
import { PremiumComparison } from "@/features/premium/components/premium-comparison";
import { cn } from "@/lib/utils";

const periods: { id: BillingPeriod; label: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "annual", label: "Annual" },
];

function notifyUnavailable() {
  showToast({ message: premiumUnavailableMessage });
}

export function PremiumTakeover({ dismiss }: { dismiss: RouteModalDismiss }) {
  const close = useRouteModalClose(dismiss);
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const [planId, setPlanId] = useState<PremiumPlanId>("premium");
  const plan =
    premiumPlans.find((item) => item.id === planId) ?? premiumPlans[0];
  const summary = plan.prices[period];

  return (
    <Modal
      label="Subscribe to Premium"
      onClose={close}
      animated={false}
      className="h-full max-h-none w-full max-w-none rounded-none"
    >
      <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute top-4 left-4 z-1 flex size-9 items-center justify-center rounded-full bg-[rgb(15_20_25/0.75)] backdrop-blur-[4px] transition-colors duration-200 ease-[ease] hover:bg-[rgb(39_44_48/0.75)]"
        >
          <CloseIcon className="size-5" />
        </button>

        <div className="flex flex-col items-center px-4 pt-0.5 pb-[220px] max-[699px]:pb-[340px]">
          <PremiumHero />
          <h1 className="mt-6 text-center text-[28px] leading-9 font-medium max-[599px]:text-[23px] max-[599px]:leading-7">
            {premiumHeadline.before}
            <span className="text-accent">{premiumHeadline.highlight}</span>
            {premiumHeadline.after}
          </h1>

          <div className="relative mt-7">
            <div
              role="radiogroup"
              aria-label="Billing period"
              className="flex gap-1 rounded-full bg-[rgb(32_35_39)] p-1"
            >
              {periods.map((item) => {
                const active = item.id === period;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setPeriod(item.id)}
                    className={cn(
                      "flex h-11 w-40 items-center justify-center rounded-full text-base transition-colors duration-200 ease-[ease] max-[399px]:w-32",
                      active
                        ? "bg-white font-bold text-inverted-foreground"
                        : "text-muted hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            {period === "annual" ? (
              <span className="absolute top-full left-[84px] mt-1.5 -translate-x-1/2 rounded-md bg-accent px-3 py-1 text-sm font-medium whitespace-nowrap text-white max-[399px]:left-[68px]">
                <span
                  aria-hidden
                  className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-accent"
                />
                Offer available
              </span>
            ) : null}
          </div>

          <div
            role="radiogroup"
            aria-label="Plans"
            className="mt-7 flex flex-wrap items-stretch justify-center gap-4"
          >
            {premiumPlans.map((item) => (
              <PremiumPlanCard
                key={item.id}
                plan={item}
                period={period}
                selected={item.id === planId}
                onSelect={() => setPlanId(item.id)}
              />
            ))}
          </div>

          <div className="mt-8 flex w-full max-w-[736px] items-center rounded-2xl bg-menu-hover p-4 max-[599px]:flex-wrap">
            <Image
              src={premiumBusiness.badgeUrl}
              alt=""
              width={50}
              height={50}
              className="size-[50px] shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xl leading-6 font-medium">
                {premiumBusiness.title}
              </p>
              <p className="mt-2 text-base text-muted">{premiumBusiness.body}</p>
            </div>
            <button
              type="button"
              onClick={notifyUnavailable}
              className="ml-4 flex h-[34px] shrink-0 items-center rounded-full bg-white/25 px-4 text-base font-bold text-white transition-colors duration-200 ease-[ease] hover:bg-white/30"
            >
              {premiumBusiness.action}
            </button>
          </div>

          <div className="mt-16 w-full">
            <PremiumComparison />
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t border-keycap-border bg-black/75 p-4 backdrop-blur-[12px]">
        <div className="mx-auto flex max-w-[811px] items-start justify-between gap-4 max-[699px]:flex-col max-[699px]:gap-3">
          <div className="w-80 max-w-full">
            <p className="text-xl leading-6 font-medium">{plan.name}</p>
            <p className="mt-4 mb-2 flex items-baseline gap-1">
              <span className="text-[32px] leading-8">
                {summary.summaryAmount}
              </span>
              <span className="text-base text-muted">
                {summary.summaryUnit}
              </span>
            </p>
            <p className="text-base text-muted">{summary.summaryDetail}</p>
          </div>
          <div className="w-[475px] max-w-full">
            <button
              type="button"
              onClick={notifyUnavailable}
              className="flex h-[52px] w-full items-center justify-center rounded-full bg-white text-lg font-bold text-inverted-foreground transition-colors duration-200 ease-[ease] hover:bg-inverted-hover"
            >
              Subscribe &amp; Pay
            </button>
            <p className="mt-3 rounded-lg border border-[rgb(130_154_171)] p-2 text-[13px] leading-4 text-foreground/90">
              <i>By subscribing, you agree to our </i>
              <a
                href={premiumLegalLinks.purchaserTerms}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline"
              >
                Purchaser Terms
              </a>
              <i>, and that</i> subscriptions auto-renew until you cancel.{" "}
              <a
                href={premiumLegalLinks.cancel}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline"
              >
                Cancel anytime
              </a>
              , at least 24 hours prior to renewal to avoid additional
              charges. Price subject to change.{" "}
              <i>
                Manage your subscription through the platform you subscribed
                on.
              </i>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
