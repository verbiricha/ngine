import { useMemo } from "react";

import useEvent from "./useEvent";

export default function useAddress(address: string, relays?: string[]) {
  const { kind, pubkey, identifier } = useMemo(() => {
    const [k, pubkey, identifier] = address.split(":");
    return { kind: Number(k), pubkey, identifier };
  }, [address]);
  const event = useEvent(
    {
      kinds: [kind],
      authors: [pubkey],
      "#d": [identifier],
    },
    {},
    relays,
  );
  return event;
}
