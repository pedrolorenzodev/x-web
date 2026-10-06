import type { NewsCategory } from "@/types/news";
import { NewsRow } from "@/components/explore/news-row";
import { EmptyState } from "@/components/ui/empty-state";
import { getNews } from "@/features/explore/api/get-news";

export async function ExploreNews({ category }: { category: NewsCategory }) {
  const { items } = await getNews(category, null, 20);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Nothing to see here — yet"
        body="When there’s news in this category, it’ll show up here."
      />
    );
  }

  return items.map((story) => <NewsRow key={story.id} story={story} />);
}
