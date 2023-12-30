"use client";

import { NDKKind } from "@nostr-dev-kit/ndk";
import { Feed } from "@ngine/core";

import Layout from "@ui/layout";
import EmojiSet from "@ui/emoji-set";

export default function Browse() {
  return (
    <Layout>
      <Feed
        closeOnEose
        pageSize={20}
        filter={{
          kinds: [NDKKind.EmojiSet],
        }}
        components={{ [NDKKind.EmojiSet]: EmojiSet }}
      />
    </Layout>
  );
}
