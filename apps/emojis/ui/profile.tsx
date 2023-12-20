"use client";

import { useMemo } from "react";
import {
  Stack,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Progress,
} from "@chakra-ui/react";
import {
  useProfile,
  useLatestEvent,
  useEvents,
  User,
  Address,
  Feed,
  ZapButton,
  Markdown,
  Emoji,
} from "@ngine/core";
import { NDKKind, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
import groupBy from "lodash.groupby";

import EmojiSet from "./emoji-set";

function ReactionStats({ pubkey }: { pubkey: string }) {
  // todo: lazy
  const { events } = useEvents(
    {
      kinds: [NDKKind.Reaction],
      authors: [pubkey],
    },
    {
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
    },
  );
  const grouped = useMemo(() => {
    return groupBy(events, "content");
  }, [events]);
  const sorted = useMemo(() => {
    return Object.entries(grouped).sort((a, b) => b[1].length - a[1].length);
  }, [grouped]);
  return (
    <Stack gap={3}>
      {sorted.map((entry) => {
        const [content, samples] = entry;
        const isCustomEmoji = content.includes(":");
        const customEmojis = samples[0].tags.filter(
          (t) => t[0] === "emoji" && content.includes(t[1]),
        );
        const frequency = (samples.length / events.length) * 100;
        return (
          <>
            <HStack align="center" justify="space-between">
              <HStack>
                {isCustomEmoji ? (
                  customEmojis.map((t) => (
                    <Emoji alt={t[1]} src={t[2]} boxSize={8} />
                  ))
                ) : (
                  <Text fontSize="2xl">
                    {content === "+" ? "👍" : content === "-" ? "👎" : content}
                  </Text>
                )}
              </HStack>
              <HStack>
                <Text
                  textAlign="right"
                  fontSize="xl"
                  color="chakra-subtle-text"
                >
                  {samples.length}
                </Text>
              </HStack>
            </HStack>
            <Progress size="sm" colorScheme="brand" value={frequency} />
          </>
        );
      })}
    </Stack>
  );
}

export default function Profile({ pubkey }: { pubkey: string }) {
  const profile = useProfile(pubkey);
  const event = useLatestEvent({
    kinds: [NDKKind.EmojiList],
    authors: [pubkey],
  });
  const emojiPacks =
    event?.tags
      .filter((t) => t[0] === "a" && t[1]?.startsWith(`${NDKKind.EmojiSet}`))
      .map((t) => t[1]) || [];
  return (
    <Stack key={pubkey} gap={4}>
      <HStack justify="space-between">
        <User size="lg" fontSize="xl" pubkey={pubkey} />
        <ZapButton pubkey={pubkey} variant="outline" size="sm" />
      </HStack>
      {profile?.about && (
        <Markdown color="chakra-subtle-text" content={profile.about} />
      )}

      <Tabs variant="solid-rounded" colorScheme="brand">
        <TabList>
          <Tab>Favorite</Tab>
          <Tab>Created</Tab>
          <Tab>Reactions</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <Stack align="center" gap={3}>
              {emojiPacks.map((address: string) => (
                <Address
                  address={address}
                  components={{
                    [NDKKind.EmojiSet]: EmojiSet,
                  }}
                />
              ))}
            </Stack>
          </TabPanel>
          <TabPanel px={0}>
            <Feed
              closeOnEose
              hideShowMore
              hideLoadMore
              filter={{
                kinds: [NDKKind.EmojiSet],
                authors: [pubkey],
              }}
              components={{
                [NDKKind.EmojiSet]: EmojiSet,
              }}
              cacheUsage={NDKSubscriptionCacheUsage.PARALLEL}
            />
          </TabPanel>

          <TabPanel px={0}>
            <ReactionStats pubkey={pubkey} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
}
