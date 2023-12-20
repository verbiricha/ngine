import { useMemo } from "react";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { tagValues, useEvent, useEvents, useAddresses } from "@ngine/core";
import { nip13 } from "nostr-tools";

export default function useBadges(pubkey: string) {
  const event = useEvent({ kinds: [NDKKind.ProfileBadge], authors: [pubkey] });
  const addresses = event ? tagValues(event, "a") : [];
  const awards = event ? tagValues(event, "e") : [];
  const badgeAdresses = [...new Set(addresses)];
  const { events: badgeEvents } = useAddresses(badgeAdresses, {
    disable: addresses.length === 0,
  });
  const { events: awardEvents } = useEvents(
    { ids: awards },
    {
      disable: awards.length === 0,
    },
  );
  const badges = useMemo(() => {
    const evs = [...badgeEvents];
    return evs.sort((a, b) => nip13.getPow(b.id) - nip13.getPow(a.id));
  }, [badgeEvents]);
  return { badges, awards: awardEvents };
}
