"use client";

import { useMemo } from "react";
import { nip19 } from "nostr-tools";
import { Alert, AlertIcon } from "@chakra-ui/react";
import { NDKKind } from "@nostr-dev-kit/ndk";

import Layout from "@ui/layout";
import EditEmojiSet from "@ui/edit-emoji-set";

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
      {address && address.kind === NDKKind.EmojiSet ? (
        <EditEmojiSet {...address} />
      ) : (
        <Alert>
          <AlertIcon />
          Can't edit address
        </Alert>
      )}
    </Layout>
  );
}
