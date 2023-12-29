"use client";

import { useMemo } from "react";
import { Stat, StatLabel, StatNumber, StatGroup } from "@chakra-ui/react";
import {
  NDKEvent,
  NDKKind,
  NDKSubscriptionCacheUsage,
} from "@nostr-dev-kit/ndk";

function zeroPlaceholder(n: number, placeholder = "-") {
  return n === 0 ? placeholder : n;
}

export default function BadgeStats({
  badges,
  awards,
}: {
  badges: NDKEvent[];
  awards: NDKEvent[];
}) {
  const creators = useMemo(() => {
    return new Set(badges.map((ev) => ev.pubkey));
  }, [badges]);
  return (
    <StatGroup gap={{ base: 12, lg: 20 }}>
      {/* @ts-ignore */}
      <Stat align="center">
        <StatNumber fontSize="6xl">{zeroPlaceholder(badges.length)}</StatNumber>
        <StatLabel fontSize="xl" color="chakra-subtle-text">
          badges
        </StatLabel>
      </Stat>

      {/* @ts-ignore */}
      <Stat align="center">
        <StatNumber fontSize="6xl">{zeroPlaceholder(creators.size)}</StatNumber>
        <StatLabel fontSize="xl" color="chakra-subtle-text">
          creators
        </StatLabel>
      </Stat>

      {/* @ts-ignore */}
      <Stat align="center">
        <StatNumber fontSize="6xl">{zeroPlaceholder(awards.length)}</StatNumber>
        <StatLabel fontSize="xl" color="chakra-subtle-text">
          awardees
        </StatLabel>
      </Stat>
    </StatGroup>
  );
}
