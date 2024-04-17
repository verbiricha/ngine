import { useMemo } from "react";
import { nip19 } from "nostr-tools";
import { useEvent } from "@ngine/core";

export default function useNaddr(naddr: string) {
  const address = useMemo(() => {
    try {
      const decoded = nip19.decode(naddr);
      if (decoded.type === "naddr") {
        return decoded.data;
      }
    } catch (error) {
      console.error(error);
    }
  }, [naddr]);
  const { kind, pubkey, identifier, relays } = address || {};
  const event = useEvent(
    {
      kinds: [kind!],
      authors: [pubkey!],
      "#d": [identifier!],
    },
    {
      disable: !address,
    },
    relays,
  );
  return event;
}
