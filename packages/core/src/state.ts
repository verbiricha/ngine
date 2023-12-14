import { atom, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { NDKEvent } from "@nostr-dev-kit/ndk";

import type { Relay, Rates, Session, Currency } from "./types";

export const sessionAtom = atomWithStorage<Session | null>(
  "ngine.session",
  null,
);
export const relaysAtom = atom<Relay[]>([]);
export const followsAtom = atom<NDKEvent | null>(null);
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
