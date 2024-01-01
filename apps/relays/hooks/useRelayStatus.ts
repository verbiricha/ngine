import { NDKKind, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
import { useEvent, useEvents } from "@ngine/core";

export function useStatus(url: string) {
  const event = useEvent(
    {
      kinds: [30_066 as NDKKind],
      "#d": [url],
      authors: [
        "151c17c9d234320cf0f189af7b761f63419fd6c38c6041587a008b7682e4640f",
      ],
    },
    {
      cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
    },
  );
  return event;
}

export default function useRelayStatus() {
  const { events } = useEvents(
    {
      kinds: [30_066 as NDKKind],
      authors: [
        "151c17c9d234320cf0f189af7b761f63419fd6c38c6041587a008b7682e4640f",
      ],
    },
    {
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
    },
  );
  const online = events
    .filter((e) => e.tagValue("s") === "online")
    .map((e) => e.tagValue("d"))
    .filter((s) => s) as string[];
  const offline = events
    .filter((e) => e.tagValue("s") !== "online")
    .map((e) => e.tagValue("d"))
    .filter((s) => s) as string[];
  return { events, online, offline };
}
