"use client";

import { useMemo } from "react";
import { nip19 } from "nostr-tools";
import { Alert, AlertIcon } from "@chakra-ui/react";

import Layout from "@ui/layout";
import Pubkey from "@ui/pubkey";

export default function ProfilePage({ params }: { params: { npub: string } }) {
  // todo: not found msg
  const { npub } = params;
  const pubkey = useMemo(() => {
    try {
      const decoded = nip19.decode(npub);
      if (decoded.type === "npub") {
        return decoded.data;
      }
      if (decoded.type === "nprofile") {
        return decoded.data.pubkey;
      }
    } catch (error) {
      console.error(error);
    }
  }, [npub]);

  return (
    <Layout>
      {pubkey ? (
        <Pubkey pubkey={pubkey} />
      ) : (
        <Alert status="error">
          <AlertIcon />
          Profile not found
        </Alert>
      )}
    </Layout>
  );
}
