import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/features/auth/api/get-session";
import { routes } from "@/config/routes";
import { getComposeTarget } from "@/features/compose/api/get-compose-target";
import { ComposeModal } from "@/features/compose/components/compose-modal";

async function ViewerComposeModal({
  searchParams,
}: Pick<PageProps<"/compose/post">, "searchParams">) {
  const session = await getSession();
  if (!session) redirect(routes.expiredSession);

  const target = await getComposeTarget(await searchParams);

  return (
    <ComposeModal viewer={session.user} dismiss="back" target={target} />
  );
}

export default function InterceptedComposePostPage({
  searchParams,
}: PageProps<"/compose/post">) {
  return (
    <Suspense fallback={null}>
      <ViewerComposeModal searchParams={searchParams} />
    </Suspense>
  );
}
