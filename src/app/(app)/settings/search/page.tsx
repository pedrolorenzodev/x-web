import { Suspense } from "react";
import HomePage from "@/app/(app)/page";
import { routes } from "@/config/routes";
import { SearchSettingsRoute } from "@/app/(app)/settings/search/_components/search-settings-route";

export { metadata } from "@/app/(app)/page";

export default function SearchSettingsPage() {
  return (
    <>
      <HomePage />
      <Suspense fallback={null}>
        <SearchSettingsRoute dismiss={{ replace: routes.home }} />
      </Suspense>
    </>
  );
}
