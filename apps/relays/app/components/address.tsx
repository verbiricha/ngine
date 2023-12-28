"use client";

import { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import {
  Stack,
  HStack,
  Heading,
  Alert,
  AlertIcon,
  Skeleton,
} from "@chakra-ui/react";
import { NDKKind, NDKEvent } from "@nostr-dev-kit/ndk";
import { useEvent, User, Event } from "@ngine/core";

import RelaysFeed from "./relays-feed";
import SearchFeed from "./search-feed";
import RelayLink from "./relay-link";
import { tagToRelay } from "../utils";
import { useRelaysMetadata } from "../hooks/useRelayMetadata";

function RelaySet({ event }: { event: NDKEvent }) {
  const title = useMemo(() => event.tagValue("title"), [event]);
  const relays = useMemo(() => {
    return event.tags.filter((t) => t[0] === "relay").map(tagToRelay);
  }, [event]);
  const urls = relays.map((r) => r.url);
  const results = useRelaysMetadata(urls);
  const searchRelays = results
    .map((r, idx) => {
      return { url: relays[idx].url, data: r.data };
    })
    .filter((r) => r.data?.supported_nips.includes(50))
    .map((r) => r.url);
  return relays.length > 0 ? (
    <Stack gap={4}>
      <HStack justify="space-between">
        <Heading>
          {title || (
            <FormattedMessage
              id="relay-set"
              description="Relay Set title"
              defaultMessage="Relay Set"
            />
          )}
        </Heading>
        <User pubkey={event.pubkey} size="xs" fontSize="sm" />
      </HStack>
      <Stack>
        {urls.map((url) => (
          <RelayLink key={url} url={url} />
        ))}
      </Stack>
      {searchRelays.length > 0 ? (
        <SearchFeed searchRelays={searchRelays} relays={urls} />
      ) : (
        <RelaysFeed relays={urls} />
      )}
    </Stack>
  ) : (
    <Alert status="error">
      <AlertIcon />
      <FormattedMessage
        id="bad-relayset"
        description="Error message when a relay set does not have relay URLs"
        defaultMessage="This relay set does not contain relay URLs"
      />
    </Alert>
  );
}

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
    <Event event={event} components={{ [NDKKind.RelaySet]: RelaySet }} />
  ) : (
    <Skeleton height="21px" />
  );
}
