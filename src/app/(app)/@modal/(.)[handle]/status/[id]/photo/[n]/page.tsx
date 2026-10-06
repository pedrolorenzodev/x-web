import { Suspense } from "react";
import { TweetPhotoViewer } from "@/app/(app)/[handle]/status/[id]/photo/[n]/_components/tweet-photo-viewer";

export default function InterceptedTweetPhotoPage({
  params,
}: PageProps<"/[handle]/status/[id]/photo/[n]">) {
  return (
    <Suspense fallback={null}>
      <TweetPhotoViewer params={params} intercepted />
    </Suspense>
  );
}
