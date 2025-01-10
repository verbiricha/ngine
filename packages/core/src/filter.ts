import { NDKKind, NDKFilter } from "@nostr-dev-kit/ndk";

export function addressesToFilter(addresses: string[]): NDKFilter {
  const filter = addresses.reduce(
    (acc, a) => {
      const [k, pubkey, ...d] = a.split(":");
      acc.kinds.add(Number(k));
      acc.authors.add(pubkey);
      // joining again in case the badge unique name contained a ':' character
      acc["#d"].add(d.join(':'));
      return acc;
    },
    {
      kinds: new Set<NDKKind>(),
      authors: new Set<string>(),
      "#d": new Set<string>(),
    },
  );
  return {
    kinds: [...filter.kinds],
    authors: [...filter.authors],
    "#d": [...filter["#d"]],
  };
}
