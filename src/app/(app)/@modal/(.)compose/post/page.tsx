import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/features/auth/api/get-session";
import { routes } from "@/config/routes";
import { getComposeSetup } from "@/features/compose/api/get-compose-setup";
import { ComposeModal } from "@/features/compose/components/compose-modal";

async function ViewerComposeModal({
  searchParams,
}: Pick<PageProps<"/compose/post">, "searchParams">) {
  const session = await getSession();
  if (!session) redirect(routes.expiredSession);

  const setup = await getComposeSetup(await searchParams);

  return (
    <ComposeModal viewer={session.user} dismiss="back" setup={setup} />
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
