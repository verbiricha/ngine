import { useState, useEffect, useMemo } from "react";

import {
  NDKEvent,
  NDKFilter,
  NDKRelaySet,
  NDKSubscriptionCacheUsage,
} from "@nostr-dev-kit/ndk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { useNDK } from "../context";
import { hashSha256 } from "../utils";
import { SubscriptionOptions } from "./useEvents";

export default function useEvent(
  filter: NDKFilter,
  opts?: SubscriptionOptions,
  relays?: string[],
) {
  const ndk = useNDK();
  const id = useMemo(() => {
    return hashSha256(filter);
  }, [filter]);

  const query: UseQueryResult<NDKEvent, any> = useQuery({
    queryKey: ["use-event", id],
    queryFn: () => {
      const relaySet =
        relays?.length ?? 0 > 0
          ? NDKRelaySet.fromRelayUrls(relays as string[], ndk)
          : undefined;
      return ndk.fetchEvent(
        filter,
        {
          groupable: true,
          cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
          ...(opts ? opts : {}),
        },
        relaySet,
      );
    },
  });

  return query.data;
}
