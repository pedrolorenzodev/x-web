import { routes } from "@/config/routes";
import { LogoutDialog } from "@/features/auth/components/logout-dialog";

export default function LogoutPage() {
  return <LogoutDialog dismiss={{ replace: routes.home }} />;
}
