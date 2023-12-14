import { useState, useEffect } from "react";
import { NDKUserProfile, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";

import { useNDK } from "../context";

export default function useProfile(pubkey: string) {
  const ndk = useNDK();
  const [profile, setProfile] = useState<NDKUserProfile | null>(null);

  useEffect(() => {
    const user = ndk.getUser({ hexpubkey: pubkey });
    user
      .fetchProfile({
        cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
      })
      .then(setProfile);
  }, [pubkey]);

  return profile;
}
