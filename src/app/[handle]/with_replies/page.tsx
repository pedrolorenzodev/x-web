import { Suspense } from "react";

async function ProfileReplies({
  params,
}: {
  params: PageProps<"/[handle]/with_replies">["params"];
}) {
  const { handle } = await params;
  return <h1>Replies: {handle}</h1>;
}

export default function ProfileRepliesPage({
  params,
}: PageProps<"/[handle]/with_replies">) {
  return (
    <Suspense fallback={null}>
      <ProfileReplies params={params} />
    </Suspense>
  );
}
