"use client"

import { useMemo } from "react";
import { nip19 } from "nostr-tools";

import Layout from "../../components/layout";
import Pubkey from "../../components/pubkey";

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
      <Pubkey pubkey={pubkey} />
    </Layout>
  );
}
