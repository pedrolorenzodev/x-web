import { useEffect, useRef, useState } from "react";
import type { AvailabilityResult, HandleError } from "@/types/auth";
import { HANDLE_CHECK_DELAY_MS } from "@/config/auth";
import { checkHandleAvailable } from "@/features/auth/api/check-handle-available";
import { validateHandle } from "@/features/auth/utils/validate-sign-up";

type HandleCheck = {
  handle: string;
  result: AvailabilityResult<HandleError>;
};

export function useHandleAvailability(handle: string) {
  const [check, setCheck] = useState<HandleCheck | null>(null);
  const checkedBeforeRef = useRef(false);
  const localError = handle === "" ? null : validateHandle(handle);

  useEffect(() => {
    if (handle === "" || localError) return;
    const delay = checkedBeforeRef.current ? HANDLE_CHECK_DELAY_MS : 0;
    checkedBeforeRef.current = true;
    let active = true;
    const timer = setTimeout(async () => {
      const result = await checkHandleAvailable(handle);
      if (active) setCheck({ handle, result });
    }, delay);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [handle, localError]);

  if (handle === "") return null;
  if (localError) return { ok: false, error: localError } as const;
  if (!check) return null;
  if (check.handle === handle) return check.result;
  return check.result.ok ? null : check.result;
}
