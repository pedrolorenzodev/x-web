import { Suspense } from "react";
import { SearchPanel } from "@/app/(app)/@panel/_modules/search-panel";

function decodeTag(tag: string) {
  try {
    return decodeURIComponent(tag);
  } catch {
    return tag;
  }
}

async function HashtagSearchPanel({
  params,
  searchParams,
}: PageProps<"/hashtag/[tag]">) {
  const [{ tag }, query] = await Promise.all([params, searchParams]);

  return (
    <SearchPanel source={{ kind: "hashtag", tag: decodeTag(tag) }} params={query} />
  );
}

export default function HashtagPanelPage(props: PageProps<"/hashtag/[tag]">) {
  return (
    <Suspense fallback={null}>
      <HashtagSearchPanel {...props} />
    </Suspense>
  );
}
