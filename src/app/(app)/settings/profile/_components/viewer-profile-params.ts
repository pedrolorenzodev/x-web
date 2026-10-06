import { getSession } from "@/features/auth/api/get-session";

export async function viewerProfileParams() {
  const session = await getSession();
  return { handle: session?.user.handle ?? "" };
}
