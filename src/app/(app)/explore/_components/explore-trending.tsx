import { TrendList } from "@/components/explore/trend-list";
import { getTrends } from "@/features/explore/api/get-trends";

export async function ExploreTrending() {
  const { items } = await getTrends(null, 30);

  return <TrendList trends={items} ranked />;
}
