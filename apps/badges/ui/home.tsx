"use client";

import { useMemo } from "react";
import { NDKKind, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
import {
  useColorModeValue,
  Box,
  Stack,
  HStack,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useEvents, Feed, User } from "@ngine/core";

import { getPow } from "@core/rarity";
import Grid from "./grid";
import Badge from "./badge";
import BadgeStats from "./badge-stats";
import BadgeAward from "./badge-award";
import ProfileBadge from "./profile-badge";
import { gradient } from "./const";

function Awards() {
  return (
    <Feed
      filter={{
        kinds: [NDKKind.BadgeAward],
      }}
      pageSize={3}
      components={{
        [NDKKind.BadgeAward]: BadgeAward,
        [NDKKind.BadgeDefinition]: Badge,
        [NDKKind.ProfileBadge]: ProfileBadge,
      }}
      hideShowMore
      hideLoadMore
    />
  );
}

function Profiles() {
  return (
    <Feed
      filter={{
        kinds: [
          //NDKKind.BadgeAward,
          //NDKKind.BadgeDefinition,
          NDKKind.ProfileBadge,
        ],
      }}
      pageSize={3}
      components={{
        [NDKKind.BadgeAward]: BadgeAward,
        [NDKKind.BadgeDefinition]: Badge,
        [NDKKind.ProfileBadge]: ProfileBadge,
      }}
      hideShowMore
      hideLoadMore
    />
  );
}

export default function Home() {
  const { events: badges, eose } = useEvents(
    {
      kinds: [NDKKind.BadgeDefinition],
    },
    {
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
    },
  );
  const { events: awards } = useEvents(
    {
      kinds: [NDKKind.BadgeAward],
    },
    {
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
    },
  );
  const { events: profiles } = useEvents(
    {
      kinds: [NDKKind.ProfileBadge],
      authors: [
        "1bc70a0148b3f316da33fe3c89f23e3e71ac4ff998027ec712b905cd24f6a411", // karnag
        "7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194", // verbi
        //"958b754a1d3de5b5eca0fe31d2d555f451325f8498a83da1997b7fcd5c39e88c" // sleepy
      ],
    },
    {
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
    },
  );
  const byRarity = useMemo(() => {
    return [...badges].sort((a, b) => getPow(b.id) - getPow(a.id));
  }, [badges]);
  const topReceivers = useMemo(() => {
    const pubkeyCounts = awards.reduce((counts, event) => {
      const pubkey = event.pubkey;
      counts[pubkey] = (counts[pubkey] || 0) + 1;
      return counts;
    }, {});

    return Object.keys(pubkeyCounts).sort(
      (a, b) => pubkeyCounts[b] - pubkeyCounts[a],
    );
  }, [awards]);

  return (
    <Stack align="center" gap={6}>
      <Flex
        align="center"
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        py={{
          base: 6,
          sm: 8,
          md: 12,
        }}
        w="100%"
        gap={6}
      >
        <Stack maxW="md">
          <Heading
            textAlign={{
              base: "center",
              md: "left",
            }}
            fontSize={{ base: "5xl", sm: "6xl" }}
            fontWeight={600}
          >
            Support creators and{" "}
            <Box
              as="mark"
              style={{
                background: gradient,
                padding: 3,
                paddingLeft: 12,
                paddingRight: 12,
                borderRight: "8px solid",
                borderBottom: "1px solid",
                borderRightColor: "#F6F6FA",
                borderBottomColor: "#F6F6FA",
                "border-top-left-radius": "32px",
                "border-bottom-right-radius": "32px",
              }}
            >
              <Text as="span" color="#F6F6FA">
                flex it
              </Text>
            </Box>
          </Heading>
          <Text
            textAlign={{
              base: "center",
              md: "left",
            }}
            color="chakra-subtle-text"
            fontSize="2xl"
          >
            Show your endorsement for artists, developers, and projects to the
            world
          </Text>
        </Stack>
        {byRarity.length > 0 && <Badge event={byRarity[0]} />}
      </Flex>
      <BadgeStats badges={badges} awards={awards} />
      <Grid py={10}>
        {byRarity.slice(1, 7).map((ev) => (
          <Badge key={ev.id} event={ev} />
        ))}
      </Grid>
      <Heading
        textAlign={{
          base: "center",
          md: "left",
        }}
        color="chakra-subtle-text"
        fontSize="4xl"
        my={5}
      >
        Brought to you by
      </Heading>
      <Grid maxCol={2} spacing={10}>
        {profiles.slice(0, 6).map((ev) => (
          <ProfileBadge key={ev.id} event={ev} />
        ))}
      </Grid>
    </Stack>
  );
}
