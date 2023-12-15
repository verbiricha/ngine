import { useState, useEffect, useMemo } from "react";

import {
  NDKEvent,
  NDKFilter,
  NDKSubscriptionOptions,
  NDKRelaySet,
} from "@nostr-dev-kit/ndk";

import { useNDK } from "../context";

export default function useLatestEvent(
  filter: NDKFilter | NDKFilter[],
  opts?: NDKSubscriptionOptions,
  relays?: string[],
) {
  const ndk = useNDK();
  const [event, setEvent] = useState<NDKEvent | undefined>();

  useEffect(() => {
    const relaySet =
      relays?.length ?? 0 > 0
        ? NDKRelaySet.fromRelayUrls(relays as string[], ndk)
        : undefined;
    const sub = ndk.subscribe({ ...filter, limit: 1 }, opts, relaySet);
    sub.on("event", (ev: NDKEvent) => {
      const lastSeen = event?.created_at ?? 0;
      const createdAt = ev?.created_at ?? 0;
      if (createdAt > lastSeen) {
        setEvent(ev);
      }
    });
    return () => {
      sub.stop();
    };
  }, []);

  return event;
}