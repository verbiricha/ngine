import { useMemo } from "react";
import { NDKKind, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
import {
  tagValues,
  useLatestEvent,
  useEvents,
  useAddresses,
} from "@ngine/core";
import { nip13 } from "nostr-tools";

export default function useBadges(pubkey: string) {
  const profile = useLatestEvent({
    kinds: [NDKKind.ProfileBadge],
    authors: [pubkey],
  });
  const addresses = profile ? tagValues(profile, "a") : [];
  const badgeAdresses = [...new Set(addresses)];
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
    return evs.sort((a, b) => nip13.getPow(b.id) - nip13.getPow(a.id));
  }, [badgeEvents]);
  return { profile, badges, awards };
}
