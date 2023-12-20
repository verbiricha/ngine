"use client";

import { useMemo } from "react";
import { nip19 } from "nostr-tools";
import { Alert, AlertIcon } from "@chakra-ui/react";

import Layout from "@ui/layout";
import Address from "@ui/address";

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
        <Alert>
          <AlertIcon />
          Address not found
        </Alert>
      )}
    </Layout>
  );
}
