"use client";

import { createContext, use, useState, type ReactNode } from "react";

type TweetVisibility = {
  hide: () => void;
  show: () => void;
};

const TweetVisibilityContext = createContext<TweetVisibility | null>(null);

export function TweetArticle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <TweetVisibilityContext
      value={{ hide: () => setHidden(true), show: () => setHidden(false) }}
    >
      <article data-testid="tweet" className={className}>
        {children}
      </article>
    </TweetVisibilityContext>
  );
}

export function useTweetVisibility() {
  return use(TweetVisibilityContext);
}
