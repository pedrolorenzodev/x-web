import { NotificationsHeader } from "@/features/notifications/components/notifications-header";

export default function NotificationsLayout({
  children,
}: LayoutProps<"/notifications">) {
  return (
    <>
      <NotificationsHeader />
      <div className="pb-[200px]">{children}</div>
    </>
  );
}
