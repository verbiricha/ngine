import { NDKKind } from "@nostr-dev-kit/ndk";
import { useMemo } from "react";
import { useEvents } from "@ngine/core";

export default function useEmojiReactions() {
  const { events } = useEvents(
    {
      kinds: [NDKKind.Reaction],
      limit: 1_00,
    },
    {
      closeOnEose: false,
    },
  );
  const reactions = useMemo(() => {
    return events.filter((e) => e.tags.find((t) => t[0] === "emoji"));
  }, [events]);
  return reactions;
}
