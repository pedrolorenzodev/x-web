"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import {
  TIMELINE_KIND_COOKIE,
  toTimelineKind,
} from "@/features/feed/types/timeline-kind";

const ONE_YEAR = 60 * 60 * 24 * 365;

export async function selectTimelineKind(kind: string) {
  (await cookies()).set(TIMELINE_KIND_COOKIE, toTimelineKind(kind), {
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR,
  });

  refresh();
}
