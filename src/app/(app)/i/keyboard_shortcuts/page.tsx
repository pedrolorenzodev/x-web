import HomePage from "@/app/(app)/page";
import { routes } from "@/config/routes";
import { KeyboardShortcutsModal } from "@/components/layout/keyboard-shortcuts-modal";

export { metadata } from "@/app/(app)/page";

export default function KeyboardShortcutsPage() {
  return (
    <>
      <HomePage />
      <KeyboardShortcutsModal dismiss={{ replace: routes.home }} />
    </>
  );
}
