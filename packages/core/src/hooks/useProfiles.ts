import { useState, useEffect } from "react";
import {
  NDKUserProfile,
  NDKSubscriptionCacheUsage,
  NDKKind,
} from "@nostr-dev-kit/ndk";

import { useNDK } from "../context";

export default function useProfiles(pubkeys: string[]) {
  const ndk = useNDK();
  const [profiles, setProfiles] = useState<NDKUserProfile[]>([]);

  useEffect(() => {
    ndk
      .fetchEvents(
        {
          kinds: [NDKKind.Metadata],
          authors: pubkeys,
        },
        {
          cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
        },
      )
      .then((profileSet) => {
        return setProfiles([...profileSet].map((ev) => JSON.parse(ev.content)));
      });
  }, [pubkeys]);

  return profiles;
}
