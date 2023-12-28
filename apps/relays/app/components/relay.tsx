"use client";

import { Stack, Alert, AlertIcon, Skeleton } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";

import RelayMetadata from "./relay-metadata";
import RelaysFeed from "./relays-feed";
import SearchFeed from "./search-feed";

import { useRelayMetadata } from "../hooks/useRelayMetadata";

export default function Relay({ url }: { url: string }) {
  const { isError, isFetched, data } = useRelayMetadata(url);
  const supportsSearch = data?.supported_nips.includes(50);
  return (
    <Stack gap={4}>
      {isError ? (
        <Alert status="error">
          <AlertIcon />
          <FormattedMessage
            id="relay-info-fetch-error"
            description="Error message when trying to fetch relay metadata"
            defaultMessage="Could not fetch relay metadata"
          />
        </Alert>
      ) : isFetched && data ? (
        <RelayMetadata url={url} metadata={data} />
      ) : !isFetched ? (
        <Skeleton height="42px" />
      ) : (
        <Alert status="error">
          <AlertIcon />
          <FormattedMessage
            id="relay-info-fetch-error"
            description="Error message when trying to fetch relay metadata"
            defaultMessage="Could not fetch relay metadata"
          />
        </Alert>
      )}
      {supportsSearch ? (
        <SearchFeed searchRelays={[url]} relays={[url]} />
      ) : (
        <RelaysFeed relays={[url]} />
      )}
    </Stack>
  );
}
