"use client";

import { Skeleton } from "@chakra-ui/react";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { useEvent, Event } from "@ngine/core";

import NewEmojiSet from "./new-emoji-set";

interface EventIdProps {
  pubkey: string;
  identifier: string;
  relays?: string[];
}

export default function EditEmojiSet({
  pubkey,
  identifier,
  relays,
}: EventIdProps) {
  const event = useEvent(
    {
      kinds: [NDKKind.EmojiSet],
      authors: [pubkey],
      "#d": [identifier],
    },
    {},
    relays,
  );
  const emojis = event?.tags
    .filter((t) => t[0] === "emoji")
    .map((t) => {
      return {
        shortcode: t[1],
        image: t[2],
      };
    });

  return event ? (
    <NewEmojiSet
      defaultIdentifier={identifier}
      defaultName={identifier}
      defaultEmojis={emojis}
    />
  ) : (
    <Skeleton height="21px" />
  );
}
