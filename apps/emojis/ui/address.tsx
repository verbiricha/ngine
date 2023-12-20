"use client";

import { Skeleton } from "@chakra-ui/react";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { useEvent, Event } from "@ngine/core";

import EmojiSet from "./emoji-set";

interface AddressProps {
  kind: number;
  pubkey: string;
  identifier: string;
  relays?: string[];
}

export default function Address({
  kind,
  pubkey,
  identifier,
  relays,
}: AddressProps) {
  const event = useEvent(
    {
      kinds: [kind],
      authors: [pubkey],
      "#d": [identifier],
    },
    {},
    relays,
  );

  return event ? (
    <Event event={event} components={{ [NDKKind.EmojiSet]: EmojiSet }} />
  ) : (
    <Skeleton height="21px" />
  );
}
