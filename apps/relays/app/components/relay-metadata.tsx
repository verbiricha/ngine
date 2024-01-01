"use client";

import { useMemo } from "react";
import { Heading, Stack, HStack } from "@chakra-ui/react";

import RelayFavicon from "./relay-favicon";
import RelaySummary from "./relay-summary";
import ToggleRelay from "./toggle-relay";
import { RelayMetadata } from "../hooks/useRelayMetadata";
import { humanize } from "@lib/urls";

export default function Metadata({
  url,
  metadata,
}: {
  url: string;
  metadata: RelayMetadata;
}) {
  const domain = useMemo(() => humanize(url), [url]);

  return (
    <Stack>
      <HStack justify="space-between" w="100%">
        <HStack gap={0}>
          <RelayFavicon url={url} />
          <Heading fontSize="2xl" ml={4}>
            {domain}
          </Heading>
        </HStack>
        <ToggleRelay url={url} />
      </HStack>
      <RelaySummary metadata={metadata} />
    </Stack>
  );
}
