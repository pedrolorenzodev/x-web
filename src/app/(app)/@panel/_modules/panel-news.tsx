import { NewsCard } from "@/components/layout/right-panel/news-card";
import { getNews } from "@/features/explore/api/get-news";

export async function PanelNews() {
  const { items } = await getNews(null, null, 3);

  return <NewsCard stories={items} />;
}
