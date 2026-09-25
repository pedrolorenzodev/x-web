import { Suspense } from "react";
import { redirect } from "next/navigation";
import HomePage from "@/app/(app)/page";
import { getSession } from "@/features/auth/api/get-session";
import { routes } from "@/config/routes";
import { ComposeModal } from "@/features/compose/components/compose-modal";

async function ViewerComposeModal() {
  const session = await getSession();
  if (!session) redirect(routes.expiredSession);

  return <ComposeModal viewer={session.user} dismiss="home" />;
}

export default function ComposePostPage() {
  return (
    <>
      <HomePage />
      <Suspense fallback={null}>
        <ViewerComposeModal />
      </Suspense>
    </>
  );
}
