import { Suspense } from "react";
import TweetPage from "@/app/(app)/[handle]/status/[id]/page";
import { TweetPhotoViewer } from "@/app/(app)/[handle]/status/[id]/photo/[n]/_components/tweet-photo-viewer";

export default function TweetPhotoPage({
  params,
  searchParams,
}: PageProps<"/[handle]/status/[id]/photo/[n]">) {
  return (
    <>
      <TweetPage params={params} searchParams={searchParams} />
      <Suspense fallback={null}>
        <TweetPhotoViewer params={params} intercepted={false} />
      </Suspense>
    </>
  );
}
