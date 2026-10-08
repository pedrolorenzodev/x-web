import { Suspense } from "react";
import { SearchSettingsRoute } from "@/app/(app)/settings/search/_components/search-settings-route";

export default function InterceptedSearchSettingsPage() {
  return (
    <Suspense fallback={null}>
      <SearchSettingsRoute dismiss="back" />
    </Suspense>
  );
}
