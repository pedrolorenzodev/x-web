import { Button } from "@/components/ui/button";
import { card } from "@/components/layout/right-panel/styles";

export function PremiumCard() {
  return (
    <section className={card}>
      <div className="flex flex-col items-start gap-[10px] px-5 py-4">
        <h2 className="text-xl font-bold">Subscribe to Premium</h2>
        <p className="text-base">
          Get rid of ads, see your analytics, boost your replies and unlock
          20+ features.
        </p>
        <Button variant="accent" className="mt-2">
          Subscribe
        </Button>
      </div>
    </section>
  );
}
