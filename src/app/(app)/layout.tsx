import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Sidebar } from "@/components/layout/sidebar";
import { RightPanel } from "@/components/layout/right-panel";
import { getSession } from "@/features/auth/api/get-session";
import { getSuggestedUsers } from "@/features/profile/api/get-suggested-users";

export default async function AppLayout({ children, modal }: LayoutProps<"/">) {
  const session = await getSession();
  if (!session) notFound();

  const suggestions = await getSuggestedUsers();

  return (
    <AppShell
      sidebar={<Sidebar viewer={session.user} />}
      panel={<RightPanel suggestions={suggestions} />}
      modal={modal}
    >
      {children}
    </AppShell>
  );
}
