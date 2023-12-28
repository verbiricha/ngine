"use client";

import { useMemo } from "react";

import {
  useColorModeValue,
  Flex,
  Box,
  Stack,
  HStack,
  Heading,
  OrderedList,
  ListItem,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  NDKEvent,
  NDKKind,
  NDKSubscriptionCacheUsage,
} from "@nostr-dev-kit/ndk";
import {
  tagValues,
  useNDK,
  useEvents,
  useAddresses,
  useContacts,
  ReactionIcon,
  Emoji,
  Event,
} from "@ngine/core";

import useEmojiReactions from "@hooks/useEmojiReactions";
import EmojiSet from "./emoji-set";
import Reaction from "./reaction";
import App from "./app";

function HighlightedNote() {
  const ndk = useNDK();
  const ev = useMemo(() => {
    return new NDKEvent(ndk, {
      created_at: 1684240980,
      content: ":belt::salmon::salmon::salmon::belt::salmon::salmon::belt:",
      tags: [
        ["emoji", "belt", "https://awayuki.github.io/emoji/v1-040.png"],
        ["emoji", "salmon", "https://awayuki.github.io/emoji/v2-011.png"],
      ],
      kind: 1,
      pubkey:
        "cd408a69cc6c737ca1a76efc3fa247c6ca53ec807f6e7c9574164164797e8162",
      id: "b66315466d5e887ae830504b2e4c0ecb1f527fecca116f2cdf0900c089b72c5f",
      sig: "5fbe0ecd8285b90eaacf93ad8d0bd16f924259532904f58cad544b7aea51db677b852d55391d275601534212bb2e63c612fec04fea80e246d437ab6a10d34f4d",
    });
  }, []);

  return (
    <Box minW="320px" maxW="420px" w="100%">
      <Event event={ev} />
    </Box>
  );
}

function SupportingApps() {
  const { events: apps } = useEvents(
    {
      kinds: [NDKKind.AppHandler],
      "#k": [String(NDKKind.EmojiSet), String(NDKKind.EmojiList)],
    },
    {
      closeOnEose: true,
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
    },
  );
  return (
    <Stack gap={6}>
      <Heading fontSize="5xl">Supported in</Heading>
      <Flex gap={9} align="center" justify="center" wrap="wrap">
        {apps.map((ev) => (
          <App key={ev.id} event={ev} />
        ))}
      </Flex>
    </Stack>
  );
}

function HowTo() {
  return (
    <Flex
      flexDirection={{ base: "column", md: "row" }}
      gap={6}
      align={{ base: "left", md: "center" }}
      justify="space-between"
    >
      <Flex w={{ base: "100%", md: "md" }} align="center" justify="center">
        <Emoji
          alt="EZ"
          src="https://cdn.betterttv.net/emote/5590b223b344e2c42a9e28e3/3x.webp"
          boxSize={20}
        />
        <Emoji
          alt="Clap"
          src="https://cdn.betterttv.net/emote/55b6f480e66682f576dd94f5/3x.webp"
          boxSize={20}
        />
      </Flex>
      <Stack>
        <Heading fontSize="5xl">How does it work?</Heading>
        <OrderedList fontSize="2xl">
          <ListItem>Create or find an emoji set</ListItem>
          <ListItem>Bookmark it</ListItem>
          <ListItem>React</ListItem>
        </OrderedList>
      </Stack>
    </Flex>
  );
}

function Hero() {
  const bg = useColorModeValue("yellow.200", "gray.800");
  return (
    <Flex
      align="center"
      flexDirection={{
        base: "column",
        lg: "row",
      }}
      py={{
        base: 0,
        md: 4,
      }}
      gap={6}
    >
      <Heading fontSize={{ base: "5xl", sm: "6xl" }}>
        Spice up your reactions with{" "}
        <Box as="mark" color="chakra-body-text" background={bg}>
          custom emotes
        </Box>
      </Heading>
      <HighlightedNote />
    </Flex>
  );
}

function EmojiPacks() {
  const contacts = useContacts();
  const { events: lists, eose } = useEvents(
    {
      kinds: [NDKKind.EmojiList],
    },
    {
      closeOnEose: true,
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
    },
  );
  const addresses = useMemo(() => {
    const addresses = lists.map((e) => tagValues(e, "a")).flat();
    const frequencyMap: Record<string, number> = {};

    addresses.forEach((str) => {
      frequencyMap[str] = (frequencyMap[str] || 0) + 1;
    });

    addresses.sort((a, b) => frequencyMap[b] - frequencyMap[a]);

    const uniqueSet = new Set();
    return addresses
      .filter((str) => {
        if (!uniqueSet.has(str)) {
          uniqueSet.add(str);
          return true;
        }
      })
      .slice(0, 7);
  }, [lists]);
  const { events: emojiPacks } = useAddresses(addresses, {
    disable: !eose,
  });
  const emojis = emojiPacks
    .map((e) => e.tags.filter((t) => t[0] === "emoji"))
    .flat();
  return (
    <>
      {/* @ts-ignore */}
      <marquee>
        {emojis.map((t) => (
          <Box key={t[1]} px={2} display="inline">
            <Emoji alt={t[1]} src={t[2]} boxSize={8} />
          </Box>
        ))}
        {/* @ts-ignore */}
      </marquee>
      <Stack>
        <Heading fontSize="5xl">Popular emoji sets</Heading>
        <SimpleGrid
          columns={{
            base: 1,
            md: 2,
            xl: 3,
          }}
          spacing={6}
        >
          {emojiPacks.map((e) => (
            <EmojiSet key={e.id} event={e} />
          ))}
        </SimpleGrid>
      </Stack>
    </>
  );
}

export default function Home() {
  return (
    <Stack
      gap={{
        base: 6,
        md: 16,
      }}
    >
      <Hero />
      <HowTo />
      <EmojiPacks />
      <SupportingApps />
    </Stack>
  );
}
