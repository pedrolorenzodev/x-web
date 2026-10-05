import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Sidebar } from "@/components/layout/sidebar";
import { getSession } from "@/features/auth/api/get-session";
import { routes } from "@/config/routes";
import { getUnreadNotificationCount } from "@/features/notifications/api/get-unread-notification-count";

export const instant = false;

export default async function AppLayout({
  children,
  modal,
  panel,
}: LayoutProps<"/">) {
  const [session, unreadNotifications] = await Promise.all([
    getSession(),
    getUnreadNotificationCount(),
  ]);
  if (!session) redirect(routes.expiredSession);

  return (
    <AppShell
      sidebar={<Sidebar viewer={session.user} unreadNotifications={unreadNotifications} />}
      panel={panel}
      modal={modal}
    >
      {children}
    </AppShell>
  );
}
