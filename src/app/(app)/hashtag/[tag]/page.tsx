import type { Metadata } from "next";
import { Suspense } from "react";
import { SpinnerRow } from "@/components/ui/spinner";
import { SearchRoute } from "@/app/(app)/search/_components/search-route";
import {
  parseSearchTab,
  readSearchParam,
} from "@/features/search/utils/search-tabs";

function decodeTag(tag: string) {
  try {
    return decodeURIComponent(tag);
  } catch {
    return tag;
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/hashtag/[tag]">): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${decodeTag(tag)} - Search / X` };
}

async function Results({ params, searchParams }: PageProps<"/hashtag/[tag]">) {
  const [{ tag }, query] = await Promise.all([params, searchParams]);

  return (
    <SearchRoute
      source={{ kind: "hashtag", tag: decodeTag(tag) }}
      tab={parseSearchTab(readSearchParam(query.f))}
    />
  );
}

export default function HashtagPage(props: PageProps<"/hashtag/[tag]">) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <Results {...props} />
    </Suspense>
  );
}
