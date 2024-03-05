"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import {
  Alert,
  AlertIcon,
  Stack,
  Button,
  Text,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import NDK, { NDKRelaySet } from "@nostr-dev-kit/ndk";
import { useIntl, FormattedMessage } from "react-intl";
import { useNDK, useRelays } from "@ngine/core";
import { useQuery } from "@tanstack/react-query";

import RelayLink from "./relay-link";
import RelayIcon from "./relay-icon";
import { encodeRelayURL } from "../utils";
import { NOSTR_WATCH_MONITOR, RELAY_METADATA } from "@ui/const";

async function fetchRelays(ndk: NDK) {
  const events = await ndk.fetchEvents(
    {
      authors: [NOSTR_WATCH_MONITOR],
      kinds: [RELAY_METADATA],
      since: Math.round(Date.now() / 1000) - 60 * 60 * 24 * 1000,
    },
    {
      closeOnEose: true,
    },
    NDKRelaySet.fromRelayUrls(["wss://history.nostr.watch"], ndk),
  );

  return Array.from(events);
}

export default function Relays() {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const [relay, setRelay] = useState("");
  const myRelays = useRelays();
  const ndk = useNDK();
  const { data: events, isError } = useQuery({
    queryKey: ["relays"],
    queryFn: () => fetchRelays(ndk),
  });
  const relayUrls = useMemo(() => {
    return (events ?? [])
      .map((e) => e.tagValue("d"))
      .filter((url) => url)
      .map((url) => url!.replace(/\/$/, ""));
  }, [events]);

  function relayScore(url: string) {
    if (myRelays.includes(url)) {
      return 1;
    }
    return 0;
  }

  const relays = useMemo(() => {
    const raw = [...relayUrls].sort((a, b) => relayScore(b) - relayScore(a));
    return raw
      .filter((url) => url.toLowerCase().includes(relay.toLowerCase()))
      .slice(0, 21);
  }, [relay, relayUrls, myRelays]);

  function goToRelay(url: string) {
    router.push(`/relay/${encodeRelayURL(url)}`);
  }

  return (
    <Stack spacing={4} w="100%">
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<Icon as={RelayIcon} color="chakra-subtle-text" />}
        />
        <Input
          type="text"
          placeholder={formatMessage({
            id: "relay-url",
            description: "Relay URL placeholder",
            defaultMessage: "Relay URL",
          })}
          onKeyPress={(ev) => {
            if (ev.key === "Enter") {
              goToRelay(relay);
            }
          }}
          value={relay}
          onChange={(ev) => setRelay(ev.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button
            h="1.75rem"
            size="sm"
            isDisabled={relay.trim().length === 0}
            onClick={() => goToRelay(relay)}
            variant="solid"
            colorScheme="brand"
          >
            <FormattedMessage
              id="go"
              description="Go to relay button"
              defaultMessage="Go"
            />
          </Button>
        </InputRightElement>
      </InputGroup>
      <Stack>
        {isError && (
          <Alert>
            <AlertIcon />
            <FormattedMessage
              id="cant-fetch-relays"
              description="Error message shown when can't fetch online relays"
              defaultMessage="Could not fetch online relays"
            />
          </Alert>
        )}
        {relays.map((url: string) => (
          <RelayLink key={url} url={url} />
        ))}
        {relays.length === 0 && relay.length > 0 && (
          <Text color="chakra-subtle-text">
            <FormattedMessage
              id="no-relays-found"
              description="Message shown when no known relay matches the search pattern"
              defaultMessage="No relays match the term `{ relay }`"
              values={{ relay }}
            />
          </Text>
        )}
      </Stack>
    </Stack>
  );
}
