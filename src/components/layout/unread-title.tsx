"use client";

import { useEffect } from "react";

const PREFIX = /^\(\d+\+?\) /;

export function UnreadTitle({ count }: { count: number }) {
  useEffect(() => {
    function apply() {
      const base = document.title.replace(PREFIX, "");
      const next = count > 0 ? `(${count}) ${base}` : base;
      if (document.title !== next) document.title = next;
    }
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.head, {
      subtree: true,
      childList: true,
      characterData: true,
    });
    return () => observer.disconnect();
  }, [count]);

  return null;
}
