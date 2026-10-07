import type { NewsCategory, NewsStory } from "@/types/news";
import type { Page } from "@/types/pagination";
import { mockNews, toNewsStory } from "@/mocks/news";
import { getMockViewer } from "@/mocks/session";
import { paginate } from "@/utils/paginate";

const PAGE_SIZE = 10;

export async function getNews(
  category: NewsCategory | null = null,
  cursor: string | null = null,
  limit = PAGE_SIZE,
): Promise<Page<NewsStory>> {
  const viewer = await getMockViewer();
  const stories = mockNews
    .filter((story) => category === null || story.category === category)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map((record) => toNewsStory(record, viewer?.id ?? null));

  return paginate(stories, cursor, limit, (story) => story.id);
}
