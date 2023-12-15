"use client";

import { useMemo } from "react";
import { Stack, Text } from "@chakra-ui/react";
import { nip19 } from "nostr-tools";
import { FormattedMessage } from "react-intl";

import Layout from "../../components/layout";
import RelayMetadata from "../../components/relay-metadata";
import RelaysFeed from "../../components/relays-feed";

export default function RelayPage({ params }: { params: { nrelay: string } }) {
  const { nrelay } = params;
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
  return (
    <Layout>
      {url ? (
        <Stack gap={4}>
          <RelayMetadata url={url} />
          <RelaysFeed relays={[url]} />
        </Stack>
      ) : (
        <Text color="chakra-subtle-text">
          <FormattedMessage
            id="no-url"
            description="No URL error message"
            defaultMessage="No URL provided"
          />
        </Text>
      )}
    </Layout>
  );
}
