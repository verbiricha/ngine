import { useMemo } from "react";
import { NDKKind, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
import {
  tagValues,
  useLatestEvent,
  useEvents,
  useAddresses,
} from "@ngine/core";

import { getPow } from "@core/rarity";

export default function useBadges(pubkey: string) {
  const profile = useLatestEvent({
    kinds: [NDKKind.ProfileBadge],
    "#d": ["profile_badges"],
    authors: [pubkey],
  });
  const addresses = profile ? tagValues(profile, "a") : [];
  const badgeAdresses = Array.from(new Set(addresses));
  const { events: badgeEvents } = useAddresses(badgeAdresses, {
    disable: addresses.length === 0,
    cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
  });
  const { events: awards } = useEvents(
    { kinds: [NDKKind.BadgeAward], "#p": [pubkey] },
    {
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
    },
  );
  const badges = useMemo(() => {
    const evs = [...badgeEvents];
    return evs.sort((a, b) => getPow(b.id) - getPow(a.id));
  }, [badgeEvents]);
  return { profile, badges, awards };
}
