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
import { useQuery } from "@tanstack/react-query";
import { useIntl, FormattedMessage } from "react-intl";
import { useRelays } from "@ngine/core";

import RelayLink from "./relay-link";
import RelayIcon from "./relay-icon";
import { encodeRelayURL } from "../utils";

export default function Relays() {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const [relay, setRelay] = useState("");
  const myRelays = useRelays();
  const { data, isFetched, isError } = useQuery({
    queryKey: ["relays"],
    queryFn: () =>
      fetch(`https://api.nostr.watch/v1/online`).then((r) => r.json()),
  });

  function relayScore(url: string) {
    if (myRelays.includes(url)) {
      return 1;
    }
    return 0;
  }

  const relays = useMemo(() => {
    const raw = data
      ? [...data].sort((a, b) => relayScore(b) - relayScore(a))
      : [];
    return raw
      .filter((url) => url.toLowerCase().includes(relay.toLowerCase()))
      .slice(0, 21);
  }, [relay, data, myRelays]);

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
        {isFetched &&
          relays.map((url: string) => <RelayLink key={url} url={url} />)}
        {isFetched && relays.length === 0 && (
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
