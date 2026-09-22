import { Suspense } from "react";

async function Tweet({
  params,
}: {
  params: PageProps<"/[handle]/status/[id]">["params"];
}) {
  const { handle, id } = await params;
  return (
    <h1>
      Tweet {id} by {handle}
    </h1>
  );
}

export default function TweetPage({
  params,
}: PageProps<"/[handle]/status/[id]">) {
  return (
    <Suspense fallback={null}>
      <Tweet params={params} />
    </Suspense>
  );
}
