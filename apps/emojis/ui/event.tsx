"use client";

import { Skeleton } from "@chakra-ui/react";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { useEvent, Event } from "@ngine/core";

import EmojiSet from "./emoji-set";

interface EventIdProps {
  id: string;
  author?: string;
  relays?: string[];
}

// todo: feed for relay list
// todo: search relays

export default function EventId({ id, author, relays }: EventIdProps) {
  const event = useEvent(
    {
      ids: [id],
      ...(author ? { authors: [author] } : {}),
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
