import type { Page } from "@/types/pagination";
import type { Trend } from "@/types/trend";
import { mockTrends } from "@/mocks/trends";
import { paginate } from "@/utils/paginate";

const PAGE_SIZE = 30;

export async function getTrends(
  cursor: string | null = null,
  limit = PAGE_SIZE,
): Promise<Page<Trend>> {
  return paginate(mockTrends, cursor, limit, (trend) => trend.id);
}
