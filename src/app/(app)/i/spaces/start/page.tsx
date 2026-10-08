import HomePage from "@/app/(app)/page";
import { routes } from "@/config/routes";
import { CreateSpaceModal } from "@/features/spaces/components/create-space-modal";

export { metadata } from "@/app/(app)/page";

export default function SpacesStartPage() {
  return (
    <>
      <HomePage />
      <CreateSpaceModal dismiss={{ replace: routes.home }} />
    </>
  );
}
