"use client";

import { useEffect, ReactNode } from "react";

import NDK from "@nostr-dev-kit/ndk";
import NDKCacheAdapterDexie from "@nostr-dev-kit/ndk-cache-dexie";
import { NgineProvider } from "@ngine/core";

import Link from "@ui/link";
import Container from "@ui/container";
import Main from "@ui/main";
import Header from "@ui/header";
import Footer from "@ui/footer";
import { theme } from "@ui/theme";

const cacheAdapter = new NDKCacheAdapterDexie({ dbName: "badges" });
const ndk = new NDK({
  explicitRelayUrls: ["wss://nos.lol", "wss://relay.snort.social", "wss://relay.damus.io", "wss://relay.nostr.band"],
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
