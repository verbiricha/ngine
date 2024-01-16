import {
  useEffect,
  createContext,
  useContext,
  ReactNode,
  ReactElement,
} from "react";
import { IntlProvider } from "react-intl";
import { useAtom, useAtomValue, Provider } from "jotai";
import {
  ChakraProvider,
  ColorModeScript,
  Link,
  LinkProps,
} from "@chakra-ui/react";
import { Dict } from "@chakra-ui/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NDK, {
  NDKKind,
  NDKNip07Signer,
  NDKNip46Signer,
  NDKPrivateKeySigner,
  NDKUser,
  NostrEvent,
  NDKEvent,
  NDKSigner,
  NDKSubscriptionCacheUsage,
} from "@nostr-dev-kit/ndk";
import { generatePrivateKey, getPublicKey } from "nostr-tools";

import useRates from "./hooks/useRates";
import useLatestEvent from "./hooks/useLatestEvent";
import { sessionAtom, relayListAtom, followsAtom, ratesAtom } from "./state";
import { theme as defaultTheme } from "./theme";
import { LinkComponent, Links } from "./types";
import { getMessages } from "./i18n";

const queryClient = new QueryClient();

interface NgineContextProps {
  ndk: NDK;
  nip07Login: () => Promise<NDKUser | undefined>;
  nip46Login: (url: string) => Promise<NDKUser | undefined>;
  nsecLogin: (nsec: string) => Promise<NDKUser>;
  npubLogin: (npub: string) => Promise<NDKUser>;
  sign: (
    ev: Omit<NostrEvent, "pubkey">,
    signer?: NDKSigner,
  ) => Promise<NDKEvent | undefined>;
  logOut: () => void;
  links?: Links;
}

const NgineContext = createContext<NgineContextProps>({
  ndk: new NDK({ explicitRelayUrls: [] }),
  nip07Login: () => {
    return Promise.reject();
  },
  nip46Login: () => {
    return Promise.reject();
  },
  nsecLogin: () => {
    return Promise.reject();
  },
  npubLogin: () => {
    return Promise.reject();
  },
  sign: () => {
    return Promise.reject();
  },
  logOut: () => {},
  links: {},
});

interface NgineProviderProps {
  ndk: NDK;
  theme?: Dict;
  links?: Links;
  children: ReactNode;
  enableFiatRates?: boolean;
  locale?: string;
}

function SessionProvider({
  pubkey,
  children,
}: {
  pubkey: string;
  children: ReactNode;
}) {
  const [contactList, setContacts] = useAtom(followsAtom);
  const [relayList, setRelayList] = useAtom(relayListAtom);

  // Contacts

  const contacts = useLatestEvent(
    {
      kinds: [NDKKind.Contacts],
      authors: [pubkey],
    },
    {
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
      closeOnEose: false,
    },
  );

  useEffect(() => {
    if (contacts) {
      const lastSeen = contactList?.created_at ?? 0;
      const createdAt = contacts.created_at ?? 0;
      if (createdAt > lastSeen) {
        setContacts(contacts.rawEvent());
      }
    }
  }, [contacts]);

  // Relays

  const relays = useLatestEvent(
    {
      kinds: [NDKKind.RelayList],
      authors: [pubkey],
    },
    {
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
      closeOnEose: false,
    },
  );

  useEffect(() => {
    if (relays) {
      const lastSeen = relayList?.created_at ?? 0;
      const createdAt = relays.created_at ?? 0;
      if (createdAt > lastSeen) {
        setRelayList(relays.rawEvent());
      }
    }
  }, [relays]);

  return children;
}

export const NgineProvider = ({
  ndk,
  theme = defaultTheme,
  links,
  children,
  enableFiatRates = false,
  locale,
}: NgineProviderProps) => {
  const [session, setSession] = useAtom(sessionAtom);
  const [, setFollows] = useAtom(followsAtom);
  const [, setRelays] = useAtom(relayListAtom);
  const [, setRates] = useAtom(ratesAtom);
  const rates = useRates(!enableFiatRates);

  useEffect(() => {
    setRates(rates);
  }, [rates]);

  useEffect(() => {
    if (session?.method === "nip07") {
      const signer = new NDKNip07Signer();
      ndk.signer = signer;
    } else if (session?.method === "nsec") {
      const signer = new NDKPrivateKeySigner(session.privkey);
      ndk.signer = signer;
    } else if (session?.method === "nip46" && session.bunker) {
      const { privkey, pubkey, relays } = session.bunker;
      const localSigner = new NDKPrivateKeySigner(privkey);
      const bunkerNDK = new NDK({ explicitRelayUrls: relays });
      bunkerNDK.connect().then(() => {
        const signer = new NDKNip46Signer(
          bunkerNDK,
          session.pubkey,
          localSigner,
        );
        ndk.signer = signer;
      });
    }
    // todo: nip05
  }, [session]);

  async function nip07Login() {
    const signer = new NDKNip07Signer();
    const user = await signer.blockUntilReady();
    if (user) {
      ndk.signer = signer;
      setSession({
        method: "nip07",
        pubkey: user.pubkey,
      });
    }
    return user;
  }

  async function nip46Login(url: string) {
    const asURL = new URL(url);
    const relays = asURL.searchParams.getAll("relay");
    const pubkey = asURL.pathname.replace(/^\/\//, "");
    const bunkerNDK = new NDK({
      explicitRelayUrls: relays,
    });
    await bunkerNDK.connect();
    const localSigner = NDKPrivateKeySigner.generate();
    const signer = new NDKNip46Signer(bunkerNDK, pubkey, localSigner);
    const user = await signer.blockUntilReady();
    if (user) {
      ndk.signer = signer;
      setSession({
        method: "nip46",
        pubkey: user.pubkey,
        bunker: {
          privkey: localSigner.privateKey as string,
          pubkey,
          relays,
        },
      });
    }
    return user;
  }

  async function npubLogin(pubkey: string) {
    const user = ndk.getUser({ hexpubkey: pubkey });
    setSession({
      method: "npub",
      pubkey: pubkey,
    });
    const profile = await user.fetchProfile({
      cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
    });
    return user;
  }

  async function nsecLogin(privkey: string) {
    const signer = new NDKPrivateKeySigner(privkey);
    const user = await signer.blockUntilReady();
    if (user) {
      ndk.signer = signer;
      setSession({
        method: "nsec",
        pubkey: user.pubkey,
        privkey,
      });
    }
    return user;
  }

  async function sign(ev: Omit<NostrEvent, "pubkey">, signer?: NDKSigner) {
    if (signer) {
      const user = await signer.user();
      const ndkEvent = new NDKEvent(ndk, { ...ev, pubkey: user.pubkey });
      await ndkEvent.sign(signer);
      return ndkEvent;
    } else if (session?.pubkey && session?.method !== "npub") {
      const ndkEvent = new NDKEvent(ndk, { ...ev, pubkey: session.pubkey });
      await ndkEvent.sign();
      return ndkEvent;
    } else {
      console.log("Could not sign event", ev);
    }
  }

  function logOut() {
    ndk.signer = undefined;
    setSession(null);
    setFollows(null);
    setRelays(null);
  }

  return (
    <NgineContext.Provider
      value={{
        ndk,
        nip07Login,
        nip46Login,
        nsecLogin,
        npubLogin,
        sign,
        logOut,
        links,
      }}
    >
      <IntlProvider
        defaultLocale="en-US"
        locale={locale || "en-US"}
        messages={getMessages(locale)}
      >
        <ChakraProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <Provider>
              <ColorModeScript
                initialColorMode={theme.config.initialColorMode}
              />
              {session ? (
                <SessionProvider pubkey={session.pubkey}>
                  {children}
                </SessionProvider>
              ) : (
                children
              )}
            </Provider>
          </QueryClientProvider>
        </ChakraProvider>
      </IntlProvider>
    </NgineContext.Provider>
  );
};

export const useExtensionLogin = () => {
  const context = useContext(NgineContext);
  if (context === undefined) {
    throw new Error("Ngine context not found");
  }
  return context.nip07Login;
};

export const usePubkeyLogin = () => {
  const context = useContext(NgineContext);
  if (context === undefined) {
    throw new Error("Ngine context not found");
  }
  return context.npubLogin;
};

export const useBunkerLogin = () => {
  const context = useContext(NgineContext);
  if (context === undefined) {
    throw new Error("Ngine context not found");
  }
  return context.nip46Login;
};

export const useNsecLogin = () => {
  const context = useContext(NgineContext);
  if (context === undefined) {
    throw new Error("Ngine context not found");
  }
  return context.nsecLogin;
};

export const useSign = () => {
  const context = useContext(NgineContext);
  if (context === undefined) {
    throw new Error("Ngine context not found");
  }
  return context.sign;
};

export const useNDK = () => {
  const context = useContext(NgineContext);
  if (context === undefined) {
    throw new Error("Ngine context not found");
  }
  return context.ndk;
};

export const useSigner = () => {
  const context = useContext(NgineContext);
  if (context === undefined) {
    throw new Error("Ngine context not found");
  }
  return context.ndk.signer;
};

type LinkType = keyof Links;

export const useLink = (type: LinkType, value: string): string | null => {
  const context = useContext(NgineContext);
  if (context === undefined) {
    throw new Error("Ngine context not found");
  }
  if (context.links && context.links[type]) {
    // @ts-ignore
    return context.links[type](value);
  }
  return null;
};

export const useLinks = (): Links | undefined => {
  const context = useContext(NgineContext);
  if (context === undefined) {
    throw new Error("Ngine context not found");
  }
  return context.links;
};

export const useLinkComponent = (): ((
  props: LinkProps,
) => ReactElement | null) => {
  const context = useContext(NgineContext);
  if (context === undefined) {
    throw new Error("Ngine context not found");
  }
  return context.links?.component ?? Link;
};

export const useLogOut = () => {
  const context = useContext(NgineContext);
  if (context === undefined) {
    throw new Error("Ngine context not found");
  }
  return context.logOut;
};
