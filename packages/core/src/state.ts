import { atom, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { NostrEvent } from "@nostr-dev-kit/ndk";

import type { Relay, Rates, Session, Currency } from "./types";

export const sessionAtom = atomWithStorage<Session | null>(
  "ngine.session",
  null,
);
export const relayListAtom = atomWithStorage<NostrEvent | null>(
  "ngine.10002",
  null,
);
export const relaysAtom = atom<Relay[]>((get) => {
  const relayList = get(relayListAtom);
  return (
    relayList?.tags
      .filter((t) => t[0] === "r")
      .map((t) => {
        const url = t[1].replace(/\/$/, "");
        const read = t.length === 2 || t[2] === "read";
        const write = t.length === 2 || t[2] === "write";
        return { url, read, write };
      }) || []
  );
});
export const followsAtom = atom<NostrEvent | null>(null);
export const contactsAtom = atom<string[]>((get) => {
  const follows = get(followsAtom);
  return follows?.tags.filter((t) => t[0] === "p").map((t) => t[1]) ?? [];
});
export const currencyAtom = atomWithStorage<Currency>("ngine.currency", "BTC");
export const ratesAtom = atomWithStorage<Rates[]>("ngine.rates", []);

export function useExchangeRate(currency: Currency): Rates | undefined {
  const rates = useAtomValue(ratesAtom);
  if (currency === "BTC") {
    return;
  }
  return rates.find((r) => r.currency === currency);
}

export function useCurrency() {
  return useAtomValue(currencyAtom);
}

export function useRates() {
  const currency = useCurrency();
  return useExchangeRate(currency);
}

export function useRelaySettings() {
  return useAtomValue(relaysAtom);
}

export function useRelays() {
  const relays = useAtomValue(relaysAtom);
  return relays.map((r) => r.url);
}

export function useSession() {
  return useAtomValue(sessionAtom);
}

export function useContacts() {
  return useAtomValue(contactsAtom);
}
