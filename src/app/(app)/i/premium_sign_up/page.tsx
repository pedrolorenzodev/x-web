import HomePage from "@/app/(app)/page";
import { routes } from "@/config/routes";
import { PremiumTakeover } from "@/features/premium/components/premium-takeover";

export { metadata } from "@/app/(app)/page";

export default function PremiumPage() {
  return (
    <>
      <HomePage />
      <PremiumTakeover dismiss={{ replace: routes.home }} />
    </>
  );
}
