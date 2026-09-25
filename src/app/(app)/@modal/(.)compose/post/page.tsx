import { notFound } from "next/navigation";
import { getSession } from "@/features/auth/api/get-session";
import { ComposeModal } from "@/features/compose/components/compose-modal";

export default async function InterceptedComposePostPage() {
  const session = await getSession();
  if (!session) notFound();

  return <ComposeModal viewer={session.user} dismiss="back" />;
}
