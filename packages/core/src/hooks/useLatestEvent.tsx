import { useState, useEffect, useMemo } from "react";

import { NDKEvent, NDKFilter, NDKRelaySet } from "@nostr-dev-kit/ndk";

import { SubscriptionOptions } from "./useEvents";
import { useNDK } from "../context";
import { hashSha256 } from "../utils";

export default function useLatestEvent(
  filter: NDKFilter | NDKFilter[],
  opts?: SubscriptionOptions,
  relays?: string[],
) {
  const ndk = useNDK();
  const [event, setEvent] = useState<NDKEvent | undefined>();
  const id = useMemo(() => {
    return hashSha256(filter);
  }, [filter]);

  useEffect(() => {
    if (filter && !opts?.disable) {
      const relaySet =
        relays?.length ?? 0 > 0
          ? NDKRelaySet.fromRelayUrls(relays as string[], ndk)
          : undefined;
      const sub = ndk.subscribe({ ...filter, limit: 1 }, opts, relaySet);
      sub.on("event", (ev: NDKEvent) => {
        const lastSeen = event?.created_at ?? 0;
        const createdAt = ev?.created_at ?? 0;
        if (createdAt >= lastSeen) {
          setEvent(ev);
        }
      });
      return () => {
        sub.stop();
      };
    }
  }, [id, opts?.disable]);

  return event;
}
