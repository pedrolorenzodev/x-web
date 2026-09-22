import { Suspense } from "react";

async function Profile({ params }: { params: PageProps<"/[handle]">["params"] }) {
  const { handle } = await params;
  return <h1>Profile: {handle}</h1>;
}

export default function ProfilePage({ params }: PageProps<"/[handle]">) {
  return (
    <Suspense fallback={null}>
      <Profile params={params} />
    </Suspense>
  );
}
