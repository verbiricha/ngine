"use client";

import { useMemo } from "react";
import { Stack, Alert, AlertIcon } from "@chakra-ui/react";
import { nip19 } from "nostr-tools";
import { FormattedMessage } from "react-intl";

import RelayMetadata from "./relay-metadata";
import RelaysFeed from "./relays-feed";

export default function Relay({ nrelay }: { nrelay: string }) {
  const url = useMemo(() => {
    try {
      const decoded = nip19.decode(nrelay);
      if (decoded.type === "nrelay") {
        return decoded.data;
      }
    } catch (error) {
      return `wss://${decodeURIComponent(nrelay)}`;
    }
  }, [nrelay]);
  return url ? (
    <Stack gap={4}>
      <RelayMetadata url={url} />
      <RelaysFeed relays={[url]} />
    </Stack>
  ) : (
    <Alert status="error">
      <AlertIcon />
      <FormattedMessage
        id="no-url"
        description="No URL error message"
        defaultMessage="No URL provided"
      />
    </Alert>
  );
}
