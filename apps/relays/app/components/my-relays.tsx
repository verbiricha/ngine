import { useState } from "react";
import {
  Heading,
  Text,
  Stack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Icon,
  Button,
} from "@chakra-ui/react";
import { useIntl, FormattedMessage } from "react-intl";
import { unixNow, useSign, useSigner, useRelaySettings } from "@ngine/core";
import { NDKKind, NDKRelay } from "@nostr-dev-kit/ndk";

import RelayIcon from "./relay-icon";
import RelaySettings from "./relay-settings";
import { relayToTag } from "../utils";

export default function MyRelays() {
  const [isBusy, setIsBusy] = useState(false);
  const [relay, setRelay] = useState("");
  const sign = useSign();
  const canSign = useSigner();
  const relays = useRelaySettings();
  const { formatMessage } = useIntl();

  async function addRelay() {
    const url =
      relay.startsWith("ws://") || relay.startsWith("wss://")
        ? relay
        : `wss://${relay}`;
    try {
      setIsBusy(true);
      const conn = new NDKRelay(url);
      await conn.connect();
      const ev = {
        kind: NDKKind.RelayList,
        created_at: unixNow(),
        content: "",
        tags: [["r", url], ...relays.map(relayToTag)],
      };
      const signed = await sign(ev);
      if (signed) {
        await signed.publish();
        setRelay("");
      }
      await conn.disconnect();
    } catch (error) {
      console.error(error);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <>
      <Heading>
        <FormattedMessage
          id="relays-page-title"
          description="Title of relays page"
          defaultMessage="Relays"
        />
      </Heading>
      <Text color="chakra-subtle-text">
        <FormattedMessage
          id="relays-description"
          description="A brief text explaining what relays are"
          defaultMessage="Relays are servers which store your posts. Other people can read your content by connecting to the relays you write to and asking for your content."
        />
      </Text>
      <FormControl>
        <FormLabel>
          <FormattedMessage
            id="add-relay-label"
            description="Label for relay adding input"
            defaultMessage="Add relay"
          />
        </FormLabel>
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
            value={relay}
            onChange={(ev) => setRelay(ev.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              isLoading={isBusy}
              isDisabled={!canSign || relay.trim().length === 0}
              h="1.75rem"
              size="sm"
              onClick={addRelay}
              variant="solid"
              colorScheme="brand"
            >
              <FormattedMessage
                id="add-button"
                description="Add relay button"
                defaultMessage="Add"
              />
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Heading fontSize="2xl">
        <FormattedMessage
          id="relays-title"
          description="Title of your relays section"
          defaultMessage="My Relays"
        />
      </Heading>
      <Stack>
        {relays.map((r) => (
          <RelaySettings key={r.url} {...r} />
        ))}
      </Stack>
    </>
  );
}
