"use client"

import { SimpleGrid } from "@chakra-ui/react";
import { NDKKind, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
import { useEvents } from "@ngine/core";

import Layout from "@ui/layout";
import EmojiSet from "@ui/emoji-set";

export default function Browse() {
  const { events: emojiSets } = useEvents(
    {
      kinds: [NDKKind.EmojiSet],
    },
    {
      closeOnEose: true,
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
    },
    ["wss://relay.nostr.band"]
  );
  return (
    <Layout>
      <SimpleGrid
        columns={{
          base: 1,
          md: 2,
        }}
        spacing={6}
      >
        {emojiSets.map((e) => (
          <EmojiSet key={e.id} event={e} />
        ))}
      </SimpleGrid>
    </Layout>
  );
}
