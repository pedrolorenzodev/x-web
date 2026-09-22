import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Sidebar } from "@/components/layout/sidebar";
import { getSession } from "@/features/auth/api/get-session";

export default async function AppLayout({ children, modal }: LayoutProps<"/">) {
  const session = await getSession();
  if (!session) notFound();

  return (
    <AppShell sidebar={<Sidebar viewer={session.user} />} modal={modal}>
      {children}
    </AppShell>
  );
}
