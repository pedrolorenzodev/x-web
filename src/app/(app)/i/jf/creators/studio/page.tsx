import type { Metadata } from "next";
import { CreatorStudioMenu } from "@/features/creator-studio/components/creator-studio-menu";

export const metadata: Metadata = {
  title: "Creator Studio / X",
};

export default function CreatorStudioPage() {
  return <CreatorStudioMenu />;
}
