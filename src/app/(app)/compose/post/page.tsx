import { notFound } from "next/navigation";
import HomePage from "@/app/(app)/page";
import { getSession } from "@/features/auth/api/get-session";
import { ComposeModal } from "@/features/compose/components/compose-modal";

export default async function ComposePostPage() {
  const session = await getSession();
  if (!session) notFound();

  return (
    <>
      <HomePage />
      <ComposeModal viewer={session.user} dismiss="home" />
    </>
  );
}
