import { Suspense } from "react";
import TweetPage from "@/app/(app)/[handle]/status/[id]/page";
import { routes } from "@/config/routes";
import { ViewsModal } from "@/features/tweet/components/views-modal";

async function StandaloneViewsModal({
  params,
}: {
  params: PageProps<"/[handle]/status/[id]/analytics">["params"];
}) {
  const { handle, id } = await params;
  return <ViewsModal dismiss={{ replace: routes.tweet(handle, id) }} />;
}

export default function ViewsPage(
  props: PageProps<"/[handle]/status/[id]/analytics">,
) {
  return (
    <>
      <TweetPage {...props} />
      <Suspense fallback={null}>
        <StandaloneViewsModal params={props.params} />
      </Suspense>
    </>
  );
}
