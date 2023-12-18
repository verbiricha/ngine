"use client";

import { useMemo } from "react";
import { Alert, AlertIcon } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { nip19 } from "nostr-tools";

import Address from "../../components/address";
import Layout from "../../components/layout";

export default function AddressPage({ params }: { params: { naddr: string } }) {
  const { naddr } = params;
  const address = useMemo(() => {
    try {
      const decoded = nip19.decode(naddr);
      if (decoded.type === "naddr") {
        return decoded.data;
      }
    } catch (error) {
      console.error(error);
    }
  }, [naddr]);

  return (
    <Layout>
      {address ? (
        <Address {...address} />
      ) : (
        <Alert status="error">
          <AlertIcon />
          <FormattedMessage
            id="bad-address"
            description="Error message when failing to decode an address"
            defaultMessage="Could not decode address"
          />
        </Alert>
      )}
    </Layout>
  );
}
