import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export default function BusinessPage() {
  redirect(routes.premiumFrom("verified_orgs"));
}
