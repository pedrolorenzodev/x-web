import HomePage from "@/app/(app)/page";
import { LogoutDialog } from "@/features/auth/components/logout-dialog";

export default function LogoutPage() {
  return (
    <>
      <HomePage />
      <LogoutDialog dismiss="home" />
    </>
  );
}
