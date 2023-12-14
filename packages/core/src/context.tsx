import {
  useEffect,
  createContext,
  useContext,
  ReactNode,
  ReactElement,
} from "react";
import { IntlProvider } from "react-intl";
import { useAtom, useAtomValue } from "jotai";
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
import { sessionAtom, relaysAtom, followsAtom, ratesAtom } from "./state";
import { theme as defaultTheme } from "./theme";
import { LinkComponent, Links } from "./types";
import { getMessages } from "./i18n";

const queryClient = new QueryClient();

interface NgineContextProps {
  ndk: NDK;
  nip07Login: () => Promise<NDKUser | undefined>;
  nsecLogin: (nsec: string) => Promise<NDKUser>;
  npubLogin: (npub: string) => Promise<NDKUser>;
  sign: (
    ev: Omit<NostrEvent, "pubkey">,
    signer?: NDKSigner,
  ) => Promise<NDKEvent | undefined>;
  links: Links;
}

const NgineContext = createContext<NgineContextProps>({
  ndk: new NDK({ explicitRelayUrls: [] }),
  nip07Login: () => {
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
  links: {},
});

interface NgineProviderProps {
  ndk: NDK;
  theme?: Dict;
  links: Links;
  children: ReactNode;
  disableFiatRates?: boolean;
  locale?: string;
}

function SessionProvider({
  pubkey,
  children,
}: {
  pubkey: string;
  children: ReactNode;
}) {
  const [, setContacts] = useAtom(followsAtom);
  const [, setRelays] = useAtom(relaysAtom);

  // Contacts

  const contacts = useLatestEvent({
    kinds: [NDKKind.Contacts],
    authors: [pubkey],
  });

  useEffect(() => {
    if (contacts) {
      setContacts(contacts);
    }
  }, [contacts]);

  // Relays

  const relays = useLatestEvent({
    kinds: [NDKKind.RelayList],
    authors: [pubkey],
  });

  useEffect(() => {
    if (relays) {
      const relaySettings = relays.tags
        .filter((t) => t[0] === "r")
        .map((t) => {
          const url = t[1];
          const read = t.length === 2 || t[2] === "read";
          const write = t.length === 2 || t[2] === "write";
          return { url, read, write };
        });
      setRelays(relaySettings);
    }
  }, [relays]);

  return children;
}

export const NgineProvider = ({
  ndk,
  theme = defaultTheme,
  links,
  children,
  disableFiatRates = false,
  locale,
}: NgineProviderProps) => {
  const [session, setSession] = useAtom(sessionAtom);
  const [, setRates] = useAtom(ratesAtom);
  const rates = useRates(disableFiatRates);

  useEffect(() => {
    setRates(rates);
  }, [rates]);

  useEffect(() => {
    if (session?.method === "nip07") {
      const sig = new NDKNip07Signer();
      ndk.signer = sig;
    } else if (session?.method === "nsec") {
      const sig = new NDKPrivateKeySigner(session.privkey);
      ndk.signer = sig;
    }
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

  return (
    <NgineContext.Provider
      value={{ ndk, nip07Login, nsecLogin, npubLogin, sign, links }}
    >
      <IntlProvider
        defaultLocale="en-US"
        locale={locale || "en-US"}
        messages={getMessages(locale)}
      >
        <ChakraProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <>
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
            </>
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

export const useLinks = (): Links => {
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
