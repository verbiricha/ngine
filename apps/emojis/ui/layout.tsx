"use client";

import { useEffect, ReactElement } from "react";

import NDK from "@nostr-dev-kit/ndk";
import NDKCacheAdapterDexie from "@nostr-dev-kit/ndk-cache-dexie";
import { NgineProvider } from "@ngine/core";

import Link from "./link";
import Container from "./container";
import Main from "./main";
import Header from "./header";
import Footer from "./footer";
import { theme } from "./theme";

const cacheAdapter = new NDKCacheAdapterDexie({ dbName: "emojis" });
const ndk = new NDK({
  explicitRelayUrls: [
    "wss://nos.lol",
    "wss://relay.nostr.band",
    "wss://frens.nostr1.com",
  ],
  outboxRelayUrls: ["wss://purplepag.es"],
  enableOutboxModel: true,
  cacheAdapter,
});

export default function Layout({ children }: { children: any }) {
  useEffect(() => {
    ndk.connect();
  }, []);

  return (
    <NgineProvider
      theme={theme}
      ndk={ndk}
      links={{
        component: Link,
        npub: (npub) => `/p/${npub}`,
        nprofile: (nprofile) => `/p/${nprofile}`,
      }}
    >
      <Container>
        <Header />
        <Main>{children}</Main>
        <Footer />
      </Container>
    </NgineProvider>
  );
}
