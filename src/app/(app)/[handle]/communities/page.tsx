import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export default async function CommunitiesPage({
  params,
}: PageProps<"/[handle]/communities">) {
  const { handle } = await params;
  redirect(routes.communitiesExplore(handle));
}
