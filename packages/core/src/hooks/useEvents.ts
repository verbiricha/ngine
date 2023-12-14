import { useState, useEffect, useMemo } from "react";

import {
  NDKEvent,
  NDKFilter,
  NDKRelaySet,
  NDKSubscriptionOptions,
} from "@nostr-dev-kit/ndk";
import uniqBy from "lodash.uniqby";

import { useNDK } from "../context";
import { hashSha256 } from "../utils";

export interface SubscriptionOptions extends NDKSubscriptionOptions {
  disable?: boolean;
}

export default function useEvents(
  filter: NDKFilter | NDKFilter[],
  opts?: SubscriptionOptions,
  relays?: string[],
) {
  const ndk = useNDK();
  const [eose, setEose] = useState(false);
  const [events, setEvents] = useState<NDKEvent[]>([]);
  const id = useMemo(() => {
    return hashSha256(filter);
  }, [filter]);

  useEffect(() => {
    if (filter && !opts?.disable) {
      const relaySet =
        relays?.length ?? 0 > 0
          ? NDKRelaySet.fromRelayUrls(relays as string[], ndk)
          : undefined;
      const sub = ndk.subscribe(filter, opts, relaySet);
      sub.on("event", (ev: NDKEvent) => {
        setEvents((evs) => {
          const newEvents = evs
            .concat([ev])
            .sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0));
          return uniqBy(newEvents, (e: NDKEvent) => e.tagId());
        });
      });
      sub.on("eose", () => {
        setEose(true);
      });
      return () => {
        sub.stop();
      };
    }
  }, [id, opts?.disable]);

  return { id, eose, events };
}
