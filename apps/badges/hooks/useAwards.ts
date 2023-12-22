import { useMemo } from "react";
import {
  NDKEvent,
  NDKKind,
  NDKSubscriptionCacheUsage,
} from "@nostr-dev-kit/ndk";
import { tagValues, useEvents } from "@ngine/core";

export default function useAwards(badge: NDKEvent): NDKEvent[] {
  const { events: awards } = useEvents(
    {
      kinds: [NDKKind.BadgeAward],
      authors: [badge.pubkey],
      ...badge.filter(),
    },
    {
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
    },
  );
  const awardees = useMemo(() => {
    return [...new Set(awards.map((aw) => tagValues(aw, "p")).flat())];
  }, [awards]);

  return { awards, awardees };
}
