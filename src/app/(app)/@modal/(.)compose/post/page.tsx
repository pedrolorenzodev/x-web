import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/features/auth/api/get-session";
import { routes } from "@/config/routes";
import { ComposeModal } from "@/features/compose/components/compose-modal";

async function ViewerComposeModal() {
  const session = await getSession();
  if (!session) redirect(routes.expiredSession);

  return <ComposeModal viewer={session.user} dismiss="back" />;
}

export default function InterceptedComposePostPage() {
  return (
    <Suspense fallback={null}>
      <ViewerComposeModal />
    </Suspense>
  );
}
