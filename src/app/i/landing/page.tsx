import type { Metadata } from "next";
import { Landing } from "@/features/auth/components/landing";

export const metadata: Metadata = {
  title: "X. It’s what’s happening / X",
};

export default function LandingPage() {
  return <Landing />;
}
