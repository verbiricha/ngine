"use client";

import { useMemo } from "react";
import { nip19 } from "nostr-tools";
import { Alert, AlertIcon } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";

import Layout from "../../components/layout";
import Relay from "../../components/relay";

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
        <Relay url={url} />
      ) : (
        <Alert status="error">
          <AlertIcon />
          <FormattedMessage
            id="no-url"
            description="No URL error message"
            defaultMessage="No URL provided"
          />
        </Alert>
      )}
    </Layout>
  );
}
