"use client";

import { useMemo } from "react";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { Stack, HStack } from "@chakra-ui/react";
import {
  useProfile,
  useEvent,
  User,
  ZapButton,
  Feed,
  Markdown,
} from "@ngine/core";
import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";

import RelaySettings from "./relay-settings";
import RelayList from "./relay-list";
import RelaySet from "./relay-set";
import { tagToRelay } from "../utils";

export default function Profile({ pubkey }: { pubkey: string }) {
  const profile = useProfile(pubkey);
  const event = useEvent(
    {
      kinds: [NDKKind.RelayList],
      authors: [pubkey],
    },
    {
      cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY,
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
              kinds: [
                NDKKind.Text,
                NDKKind.Article,
                NDKKind.RelayList,
                NDKKind.RelaySet,
              ],
              authors: [pubkey],
            }}
            components={{
              [NDKKind.RelayList]: RelayList,
              [NDKKind.RelaySet]: RelaySet,
            }}
            relays={relays.filter((r) => r.write).map((r) => r.url)}
          />
        </>
      )}
    </Stack>
  );
}
