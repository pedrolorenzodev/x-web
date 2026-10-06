import { Tab } from "@/components/ui/tab";
import type { ConnectTab } from "@/features/connect/types/connect";
import { connectTabHref } from "@/features/connect/utils/connect-query";

export function ConnectTabs({ active }: { active: ConnectTab }) {
  return (
    <nav role="tablist" className="flex border-b border-border">
      <Tab
        label="Who to follow"
        href={connectTabHref("who-to-follow")}
        active={active === "who-to-follow"}
      />
      <Tab
        label="Creators for you"
        href={connectTabHref("creators")}
        active={active === "creators"}
      />
    </nav>
  );
}
