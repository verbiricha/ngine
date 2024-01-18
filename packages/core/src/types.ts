import type { ReactNode, ReactElement } from "react";
import type { LinkProps } from "@chakra-ui/react";
import type { NDKKind, NDKEvent } from "@nostr-dev-kit/ndk";

// Reactions

export type ReactionKind =
  | NDKKind.Zap
  | NDKKind.Text
  | NDKKind.Reaction
  | NDKKind.Repost
  | NDKKind.GenericRepost
  | NDKKind.BookmarkList
  | NDKKind.CategorizedBookmarkList
  | NDKKind.RelayList
  | NDKKind.EmojiList;

// Relays

export interface Relay {
  url: string;
  read: boolean;
  write: boolean;
}

// Links

export type LinkComponent = (_: LinkProps) => ReactElement | null;

export interface Links {
  component?: LinkComponent;
  npub?: (npub: string) => string;
  nrelay?: (nrelay: string) => string;
  nprofile?: (nprofile: string) => string;
  nevent?: (nevent: string) => string;
  naddr?: (naddr: string) => string;
  t?: (t: string) => string;
}

// Sessions

// todo: nip05 with nip46
export type LoginMethod = "nip07" | "nip46" | "npub" | "nsec";

export interface Session {
  method: LoginMethod;
  pubkey: string;
  privkey?: string;
  bunker?: {
    privkey: string;
    relays: string[];
  };
}

// Components

export type Fragment = string | ReactNode;

export type EventComponent = (props: EventProps) => ReactNode;
export type Components = Record<number, EventComponent>;

export interface EventProps {
  event: NDKEvent;
  components?: Components;
  reactionKinds?: ReactionKind[];
}

// Nostr

export type Tag = string[];
export type Tags = Tag[];

// Money

export type RateSymbol = "BTCUSD" | "BTCEUR";
export type FiatCurrency = "USD" | "EUR";
export type Currency = "BTC" | "USD" | "EUR";

export interface Rates {
  time: number;
  ask: number;
  bid: number;
  low: number;
  high: number;
  currency: FiatCurrency;
  symbol: RateSymbol;
}
