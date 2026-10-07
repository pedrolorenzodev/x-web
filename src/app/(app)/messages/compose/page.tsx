import type { Metadata } from "next";
import HomePage from "@/app/(app)/page";
import { routes } from "@/config/routes";
import { ChatShareModal } from "@/features/chat/components/chat-share-modal";

export const metadata: Metadata = {
  title: "Home / X",
};

export default function ChatSharePage() {
  return (
    <>
      <HomePage />
      <ChatShareModal dismiss={{ replace: routes.home }} />
    </>
  );
}
