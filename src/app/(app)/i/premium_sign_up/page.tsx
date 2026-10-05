import type { Metadata } from "next";
import { PlaceholderScreen } from "@/components/layout/placeholder-screen";

export const metadata: Metadata = {
  title: "Premium / X",
};

export default function PremiumPage() {
  return <PlaceholderScreen title="Premium" back />;
}
