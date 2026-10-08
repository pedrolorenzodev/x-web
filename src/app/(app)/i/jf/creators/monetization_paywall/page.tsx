import type { Metadata } from "next";
import { Suspense } from "react";
import { SpinnerRow } from "@/components/ui/spinner";
import { MonetizationPaywall } from "@/features/creator-studio/components/monetization-paywall";
import type { MonetizationProduct } from "@/features/creator-studio/config/creator-studio";

export const metadata: Metadata = {
  title: "Creator Studio / X",
};

async function Paywall({
  searchParams,
}: Pick<PageProps<"/i/jf/creators/monetization_paywall">, "searchParams">) {
  const { product } = await searchParams;
  const selected: MonetizationProduct =
    product === "subscription" ? "subscription" : "original_content_rewards";
  return <MonetizationPaywall product={selected} />;
}

export default function MonetizationPaywallPage({
  searchParams,
}: PageProps<"/i/jf/creators/monetization_paywall">) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <Paywall searchParams={searchParams} />
    </Suspense>
  );
}
