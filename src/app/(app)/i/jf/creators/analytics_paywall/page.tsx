import type { Metadata } from "next";
import { AnalyticsPaywall } from "@/features/creator-studio/components/analytics-paywall";

export const metadata: Metadata = {
  title: "Analytics / X",
};

export default function AnalyticsPaywallPage() {
  return <AnalyticsPaywall />;
}
