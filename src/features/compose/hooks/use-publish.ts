import { useEffect, useRef, useTransition } from "react";
import type { NewTweetInput } from "@/types/tweet";
import { routes } from "@/config/routes";
import { showToast } from "@/components/ui/toast";
import { createTweet } from "@/features/compose/api/create-tweet";
import { formatScheduleDate } from "@/features/compose/utils/format-schedule";

type CreatedTweet = Awaited<ReturnType<typeof createTweet>>;

type PublishOptions = {
  onSettled?: () => void;
};

function announce(sent: CreatedTweet) {
  if (sent.scheduledAt) {
    showToast({
      message: `Your post will be sent on ${formatScheduleDate(sent.scheduledAt)}.`,
      action: { label: "View", href: routes.composeScheduled },
    });
    return;
  }
  showToast({
    message: "Your post was sent.",
    action: { label: "View", href: routes.tweet(sent.handle, sent.id) },
  });
}

export function usePublish({ onSettled }: PublishOptions = {}) {
  const [pending, startTransition] = useTransition();
  const sentRef = useRef<CreatedTweet | null>(null);

  useEffect(() => {
    const sent = sentRef.current;
    if (pending || !sent) return;

    sentRef.current = null;
    announce(sent);
    onSettled?.();
  }, [pending, onSettled]);

  function publish(input: NewTweetInput, onPublished: () => void) {
    startTransition(async () => {
      sentRef.current = await createTweet(input);
      onPublished();
    });
  }

  return { pending, publish };
}
