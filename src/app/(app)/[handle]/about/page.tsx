import type { Metadata } from "next";
import { Suspense } from "react";
import { SpinnerRow } from "@/components/ui/spinner";
import { routes } from "@/config/routes";
import { getSession } from "@/features/auth/api/get-session";
import { getProfile } from "@/features/profile/api/get-profile";
import { AboutAccountScreen } from "@/features/profile/components/about-account-screen";
import { ProfileNotFound } from "@/features/profile/components/profile-not-found";
import { loadProfile } from "@/app/(app)/[handle]/_lib/load-profile";

export async function generateMetadata({
  params,
}: PageProps<"/[handle]/about">): Promise<Metadata> {
  const { handle } = await params;
  const [profile, session] = await Promise.all([getProfile(handle), getSession()]);
  const isViewer = profile !== null && profile.id === session?.user.id;
  return { title: isViewer ? "About your account / X" : "About this account / X" };
}

async function About({ params }: Pick<PageProps<"/[handle]/about">, "params">) {
  const { handle } = await params;
  const data = await loadProfile(handle, routes.profileAbout);
  if (!data) return <ProfileNotFound title="About this account" />;

  return <AboutAccountScreen profile={data.profile} isViewer={data.isViewer} />;
}

export default function ProfileAboutPage({ params }: PageProps<"/[handle]/about">) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <About params={params} />
    </Suspense>
  );
}
