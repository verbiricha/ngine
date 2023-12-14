import { useState, useEffect } from "react";

import {
  NDKEvent,
  NDKFilter,
  NDKRelaySet,
  NDKSubscriptionCacheUsage,
} from "@nostr-dev-kit/ndk";

import { useNDK } from "../context";

export default function useEvent(filter: NDKFilter, relays?: string[]) {
  const ndk = useNDK();
  const [event, setEvent] = useState<NDKEvent | null>(null);

  useEffect(() => {
    const relaySet =
      relays?.length ?? 0 > 0
        ? NDKRelaySet.fromRelayUrls(relays as string[], ndk)
        : undefined;
    ndk
      .fetchEvent(
        filter,
        {
          groupable: true,
          cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
        },
        relaySet,
      )
      .then(setEvent);
  }, []);

  return event;
}
