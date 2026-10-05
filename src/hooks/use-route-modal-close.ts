"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export type RouteModalDismiss = "back" | { replace: string };

export function useRouteModalClose(dismiss: RouteModalDismiss) {
  const router = useRouter();
  const closed = useRef(false);

  useEffect(() => {
    closed.current = false;
  }, []);

  return function close() {
    if (closed.current) return;
    closed.current = true;
    if (dismiss === "back") router.back();
    else router.replace(dismiss.replace);
  };
}
