import { Suspense } from "react";
import { redirect } from "next/navigation";
import { SpinnerRow } from "@/components/ui/spinner";
import { routes } from "@/config/routes";
import { getSession } from "@/features/auth/api/get-session";

async function LikesRedirect({
  params,
}: PageProps<"/[handle]/likes">): Promise<null> {
  const [{ handle }, session] = await Promise.all([params, getSession()]);
  const isViewer =
    session?.user.handle.toLowerCase() === handle.toLowerCase();

  return redirect(isViewer ? routes.historyLikes : routes.profile(handle));
}

export default function ProfileLikesPage(props: PageProps<"/[handle]/likes">) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <LikesRedirect {...props} />
    </Suspense>
  );
}
