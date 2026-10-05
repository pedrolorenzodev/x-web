import { TrendsCard } from "@/components/layout/right-panel/trends-card";
import { getTrends } from "@/features/explore/api/get-trends";

export async function PanelTrends() {
  const { items } = await getTrends(null, 10);

  return <TrendsCard trends={items} />;
}
