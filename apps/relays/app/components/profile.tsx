"use client";

import { useMemo } from "react";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { Stack, HStack } from "@chakra-ui/react";
import {
  useProfile,
  useLatestEvent,
  User,
  ZapButton,
  Feed,
  Markdown,
} from "@ngine/core";
import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";

import RelaySettings from "./relay-settings";
import { tagToRelay } from "../utils";
import { kinds, components } from "../kinds";

export default function Profile({ pubkey }: { pubkey: string }) {
  const profile = useProfile(pubkey, NDKSubscriptionCacheUsage.PARALLEL);
  const event = useLatestEvent(
    {
      kinds: [NDKKind.RelayList],
      authors: [pubkey],
    },
    {
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
    },
  );
  const relays = useMemo(() => {
    if (!event) return [];
    return event.tags.filter((t) => t[0] === "r").map(tagToRelay);
  }, [event]);
  return (
    <Stack key={pubkey} gap={4}>
      <HStack justify="space-between">
        <User size="lg" fontSize="xl" pubkey={pubkey} />
        <ZapButton pubkey={pubkey} variant="outline" size="sm" />
      </HStack>
      {profile?.about && (
        <Markdown color="chakra-subtle-text" content={profile.about} />
      )}
      {relays.length > 0 && (
        <>
          <Stack>
            {relays.map((r) => (
              <RelaySettings key={r.url} {...r} showToggle={false} />
            ))}
          </Stack>
          <Feed
            filter={{
              kinds,
              authors: [pubkey],
            }}
            components={components}
            relays={relays.filter((r) => r.write).map((r) => r.url)}
          />
        </>
      )}
    </Stack>
  );
}
