import { useState, useEffect } from "react";
import { NDKUserProfile, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { useNDK } from "../context";

export default function useProfile(
  pubkey: string,
  cacheUsage = NDKSubscriptionCacheUsage.CACHE_FIRST,
) {
  const ndk = useNDK();
  const query: UseQueryResult<NDKUserProfile, Error> = useQuery({
    queryKey: ["profile", pubkey],
    queryFn: () => {
      const user = ndk.getUser({ hexpubkey: pubkey });
      return user.fetchProfile({
        cacheUsage,
      });
    },
  });

  return query.data;
}
