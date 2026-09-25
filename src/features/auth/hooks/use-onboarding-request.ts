import { useCallback, useRef, useState, useTransition } from "react";

type RequestOutcome = "settled" | "navigating";

export function useOnboardingRequest() {
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const activeRef = useRef<number | null>(null);
  const counterRef = useRef(0);

  function release(id: number) {
    if (activeRef.current !== id) return;
    activeRef.current = null;
    setBusy(false);
  }

  function run<Result>(
    task: () => Promise<Result>,
    onResult: (result: Result) => RequestOutcome | void,
  ) {
    if (activeRef.current !== null) return;
    counterRef.current += 1;
    const id = counterRef.current;
    activeRef.current = id;
    setBusy(true);
    startTransition(async () => {
      try {
        const result = await task();
        if (activeRef.current !== id) return;
        startTransition(() => {
          if (onResult(result) === "navigating") return;
          release(id);
        });
      } catch (error) {
        release(id);
        throw error;
      }
    });
  }

  const cancel = useCallback(() => {
    activeRef.current = null;
    setBusy(false);
  }, []);

  return { busy, run, cancel };
}
