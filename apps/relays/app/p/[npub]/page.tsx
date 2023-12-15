"use client";

import { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { Alert, AlertIcon } from "@chakra-ui/react";
import { nip19 } from "nostr-tools";

import Layout from "../../components/layout";
import Profile from "../../components/profile";

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
        <Profile pubkey={pubkey} />
      ) : (
        <Alert>
          <AlertIcon />
          <FormattedMessage
            id="bad-npub"
            description="Error shown when failing to decode npub"
            defaultMessage="Could not decode npub"
          />
        </Alert>
      )}
    </Layout>
  );
}
