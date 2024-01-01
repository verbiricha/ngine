"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import {
  Stack,
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
} from "@chakra-ui/react";
import { useIntl, FormattedMessage } from "react-intl";
import { useRelays } from "@ngine/core";

import RelayLink from "./relay-link";
import RelayIcon from "./relay-icon";
import { humanize, encode } from "@lib/urls";
import useRelayStatus from "@hooks/useRelayStatus";

export default function Relays() {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const [relay, setRelay] = useState("");
  const { events, online, offline } = useRelayStatus();
  const myRelays = useRelays();
  const relaySet = useMemo(() => new Set(myRelays.map(humanize)), [myRelays]);

  function relayScore(url: string) {
    if (relaySet.has(humanize(url))) {
      return 42;
    }
    return 0;
  }

  const relays = useMemo(() => {
    const raw = [...online].sort((a, b) => relayScore(b) - relayScore(a));
    return raw
      .filter((url) => url.toLowerCase().includes(relay.toLowerCase()))
      .slice(0, 21);
  }, [online, relay]);

  function goToRelay(url: string) {
    router.push(`/relay/${encode(url)}`);
  }

  return (
    <Stack spacing={4} w="100%">
      <StatGroup>
        {/* @ts-ignore */}
        <Stat align="center">
          <StatNumber>{events.length}</StatNumber>
          <StatLabel>Relays</StatLabel>
        </Stat>

        {/* @ts-ignore */}
        <Stat align="center">
          <StatNumber>{online.length}</StatNumber>
          <StatLabel>Online</StatLabel>
        </Stat>

        {/* @ts-ignore */}
        <Stat align="center">
          <StatNumber>{offline.length}</StatNumber>
          <StatLabel>Offline</StatLabel>
        </Stat>
      </StatGroup>
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
        {relays.map((url) => (
          <RelayLink key={url} url={url} />
        ))}
      </Stack>
    </Stack>
  );
}
