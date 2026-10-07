import type { Metadata } from "next";
import { LayoutMode } from "@/components/layout/layout-mode";
import { ChatPasscodeFlow } from "@/features/chat/components/chat-passcode-flow";

export const metadata: Metadata = {
  title: "X",
};

export default function ChatPage() {
  return (
    <>
      <LayoutMode mode="fullwidth" />
      <ChatPasscodeFlow />
    </>
  );
}
