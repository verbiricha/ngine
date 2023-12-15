"use client";

import { useEffect, ReactNode } from "react";

import NDK from "@nostr-dev-kit/ndk";
import NDKCacheAdapterDexie from "@nostr-dev-kit/ndk-cache-dexie";
import { NgineProvider } from "@ngine/core";

import Link from "./link";
import Container from "./container";
import Main from "./main";
import Header from "./header";
import Footer from "./footer";

const cacheAdapter = new NDKCacheAdapterDexie({ dbName: "relays" });
const ndk = new NDK({
  explicitRelayUrls: ["wss://nos.lol", "wss://frens.nostr1.com"],
  outboxRelayUrls: ["wss://purplepag.es"],
  enableOutboxModel: true,
  cacheAdapter,
});

export default function Layout({ children }: { children: ReactNode }) {
  useEffect(() => {
    ndk.connect();
  }, []);

  return (
    <NgineProvider
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
