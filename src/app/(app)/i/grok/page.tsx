import type { Metadata } from "next";
import { GrokScreen } from "@/features/grok/components/grok-screen";

export const metadata: Metadata = {
  title: "Grok / X",
};

export default function GrokPage() {
  return <GrokScreen />;
}
