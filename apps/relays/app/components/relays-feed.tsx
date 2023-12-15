"use client";

import { Feed } from "@ngine/core";
import { NDKKind } from "@nostr-dev-kit/ndk";

import RelayList from "./relay-list";
import RelaySet from "./relay-set";

export default function RelayFeed({ relays }: { relays: string[] }) {
  // todo: search if supported, choose kinds
  const kinds = [
    NDKKind.Text,
    NDKKind.Article,
    NDKKind.RelayList,
    NDKKind.RelaySet,
  ];
  return (
    <Feed
      filter={{ kinds }}
      relays={relays}
      components={{
        [NDKKind.RelayList]: RelayList,
        [NDKKind.RelaySet]: RelaySet,
      }}
    />
  );
}
