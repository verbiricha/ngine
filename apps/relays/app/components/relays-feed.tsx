"use client";

import { Feed } from "@ngine/core";
import { NDKKind } from "@nostr-dev-kit/ndk";

import { kinds, components } from "../kinds";

export default function RelaysFeed({ relays }: { relays: string[] }) {
  return <Feed filter={{ kinds }} relays={relays} components={components} />;
}
