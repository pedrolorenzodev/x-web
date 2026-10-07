"use client";

import { useRouter } from "next/navigation";
import type { UserSummary } from "@/types/user";
import { routes } from "@/config/routes";
import { useComposer } from "@/features/compose/hooks/use-composer";
import { ComposerForm } from "@/features/compose/components/composer-form";
import { handOffComposer } from "@/features/compose/utils/compose-handoff";
import {
  createEmptyPost,
  createEmptySnapshot,
} from "@/features/compose/utils/composer-snapshot";

export function Composer({ viewer }: { viewer: UserSummary }) {
  const router = useRouter();
  const composer = useComposer(createEmptySnapshot);

  function continueAsThread() {
    const { snapshot } = composer;
    handOffComposer({
      ...snapshot,
      posts: [...snapshot.posts, createEmptyPost()],
      activeIndex: snapshot.posts.length,
    });
    composer.reset();
    router.push(routes.composePost);
  }

  return (
    <ComposerForm
      viewer={viewer}
      composer={composer}
      variant="inline"
      target={null}
      onAddPost={continueAsThread}
    />
  );
}
