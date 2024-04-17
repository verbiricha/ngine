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
  Button,
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
import Link from "./link";
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
      <SimpleGrid
        columns={{
          base: 1,
          md: 2,
        }}
        spacing={6}
      >
        {apps.map((ev) => (
          <App key={ev.id} event={ev} />
        ))}
      </SimpleGrid>
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
      <Stack>
        <Heading fontSize="5xl">How does it work?</Heading>
        <OrderedList fontSize="2xl">
          <ListItem>Create or find an emoji set</ListItem>
          <ListItem>Bookmark it</ListItem>
          <ListItem>React</ListItem>
        </OrderedList>
      </Stack>
      <Flex w={{ base: "100%", md: "md" }} align="center" justify="center">
        <PepeParty />
      </Flex>
    </Flex>
  );
}

function Hero() {
  const bg = useColorModeValue("yellow.100", "gray.800");
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
        Stir up your reactions with{" "}
        <Box as="mark" color="chakra-body-text" background={bg}>
          custom emoji
        </Box>
      </Heading>
      <HighlightedNote />
    </Flex>
  );
}

function EmojisBelt() {
  const belt = [
    "emoji",
    "sushiyuki_belt",
    "https://awayuki.github.io/emoji/v1-040.png",
  ];
  const emojis = [
    [
      "emoji",
      "sushiyuki_belt_maguro",
      "https://awayuki.github.io/emoji/v1-037.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_ebi",
      "https://awayuki.github.io/emoji/v2-009.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_tamago",
      "https://awayuki.github.io/emoji/v1-039.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_toro",
      "https://awayuki.github.io/emoji/v2-001.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_tamago2",
      "https://awayuki.github.io/emoji/v2-003.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_hamachi",
      "https://awayuki.github.io/emoji/v2-005.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_ikura",
      "https://awayuki.github.io/emoji/v2-007.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_salmon",
      "https://awayuki.github.io/emoji/v2-011.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_kohada",
      "https://awayuki.github.io/emoji/v2-013.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_ika",
      "https://awayuki.github.io/emoji/v2-015.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_uni",
      "https://awayuki.github.io/emoji/v2-017.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_anago",
      "https://awayuki.github.io/emoji/v2-019.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_shari",
      "https://awayuki.github.io/emoji/v2-021.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_maguro2",
      "https://awayuki.github.io/emoji/v2-023.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_amaebi",
      "https://awayuki.github.io/emoji/v2-025.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_negitoro",
      "https://awayuki.github.io/emoji/v2-027.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_menegi",
      "https://awayuki.github.io/emoji/v2-029.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_inari",
      "https://awayuki.github.io/emoji/v2-031.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_saba",
      "https://awayuki.github.io/emoji/v2-032.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_tekkamaki",
      "https://awayuki.github.io/emoji/v2-033.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_kappamaki",
      "https://awayuki.github.io/emoji/v2-034.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_kappa",
      "https://awayuki.github.io/emoji/v2-035.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_heart1",
      "https://awayuki.github.io/emoji/v2-036.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_heart2",
      "https://awayuki.github.io/emoji/v2-037.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_beer",
      "https://awayuki.github.io/emoji/v2-038.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_pudding",
      "https://awayuki.github.io/emoji/v2-039.png",
    ],
    [
      "emoji",
      "sushiyuki_belt_coffee",
      "https://awayuki.github.io/emoji/v2-040.png",
    ],
  ];
  return (
    // @ts-ignore
    <marquee behavior="alternate">
      <Emoji alt={belt[1]} src={belt[2]} boxSize={8} />
      {emojis.map((t) => (
        <>
          <Emoji alt={t[1]} src={t[2]} boxSize={8} />
          <Emoji alt={belt[1]} src={belt[2]} boxSize={8} />
        </>
      ))}
      {/* @ts-ignore */}
    </marquee>
  );
}

function FeaturedEmojiPacks() {
  const addresses = [
    "30030:cd408a69cc6c737ca1a76efc3fa247c6ca53ec807f6e7c9574164164797e8162:SUSHIYUKI",
    "30030:d7607464225c8ab610da99495bc70c8a3a45a03f8a22a95f06fcb5bc421e573a:Reacts",
  ];
  const { events: emojiPacks } = useAddresses(addresses, {
    cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
  });
  const emojis = emojiPacks
    .map((e) => e.tags.filter((t) => t[0] === "emoji"))
    .flat();
  return (
    <Stack>
      <Heading fontSize="5xl">Popular</Heading>
      <SimpleGrid
        columns={{
          base: 1,
          md: 2,
        }}
        spacing={6}
      >
        {emojiPacks.map((e) => (
          <EmojiSet key={e.id} event={e} />
        ))}
      </SimpleGrid>
      <Flex align="center" justify="center" py={4}>
        <Link variant="brand" href="/browse">
          Browse all
        </Link>
      </Flex>
    </Stack>
  );
}

function PepeParty() {
  const boxSize = 12;
  return (
    <Stack align="center">
      <HStack gap={4}>
        <Emoji
          alt="xar2EDM"
          src="https://cdn.betterttv.net/emote/5b7e01fbe429f82909e0013a/3x.webp"
          boxSize={boxSize}
        />
        <Emoji
          alt="peepoDJ"
          src="https://cdn.betterttv.net/emote/6183da881f8ff7628e6c6653/3x.webp"
          boxSize={boxSize}
        />
        <Emoji
          alt="xar2EDM"
          src="https://cdn.betterttv.net/emote/5b7e01fbe429f82909e0013a/3x.webp"
          boxSize={boxSize}
        />
      </HStack>
      <HStack gap={0}>
        <Emoji
          alt="Dance"
          src="https://cdn.betterttv.net/emote/5aa1d0e311237146531078b0/3x.webp"
          boxSize={boxSize}
        />
        <Emoji
          alt="Dance"
          src="https://cdn.betterttv.net/emote/5aa1d0e311237146531078b0/3x.webp"
          boxSize={boxSize}
        />
        <Emoji
          alt="Dance"
          src="https://cdn.betterttv.net/emote/5aa1d0e311237146531078b0/3x.webp"
          boxSize={boxSize}
        />
        <Emoji
          alt="Dance"
          src="https://cdn.betterttv.net/emote/5aa1d0e311237146531078b0/3x.webp"
          boxSize={boxSize}
        />
      </HStack>
    </Stack>
  );
}

export default function Home() {
  return (
    <Stack
      gap={{
        base: 12,
        md: 16,
      }}
    >
      <Hero />
      <EmojisBelt />
      <HowTo />
      <FeaturedEmojiPacks />
      <SupportingApps />
    </Stack>
  );
}
