import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { MediaViewer } from "@/components/media-viewer/media-viewer";
import { getProfile } from "@/features/profile/api/get-profile";

const AVATAR_SIZE = 400;
const AVATAR_DISPLAY_SIZE = 368;
const BANNER_WIDTH = 1500;
const BANNER_HEIGHT = 500;

type ProfileMediaViewerProps = {
  params: Promise<{ handle: string }>;
  kind: "avatar" | "banner";
  intercepted: boolean;
};

export async function ProfileMediaViewer({
  params,
  kind,
  intercepted,
}: ProfileMediaViewerProps) {
  const { handle } = await params;
  const profile = await getProfile(handle);
  if (!profile) return null;

  const href =
    kind === "avatar"
      ? routes.profilePhoto(profile.handle)
      : routes.profileHeaderPhoto(profile.handle);

  if (kind === "banner" && !profile.bannerUrl) {
    redirect(routes.profile(profile.handle));
  }
  if (!intercepted && profile.handle !== handle) redirect(href);

  const item =
    kind === "avatar"
      ? {
          url: profile.avatarUrl,
          alt: "Image",
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          maxWidth: AVATAR_DISPLAY_SIZE,
          round: profile.verified !== "business",
        }
      : {
          url: profile.bannerUrl ?? "",
          alt: "Image",
          width: BANNER_WIDTH,
          height: BANNER_HEIGHT,
        };

  return (
    <MediaViewer
      label="Image"
      index={0}
      items={[item]}
      hrefs={[href]}
      dismiss={
        intercepted ? "back" : { replace: routes.profile(profile.handle) }
      }
    />
  );
}
