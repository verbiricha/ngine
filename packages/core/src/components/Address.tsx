import { useMemo } from "react";

import NAddr from "./NAddr";
import { Components } from "../types";

interface AddressProps {
  address: string;
  components?: Components;
}

export default function Address({ address, components }: AddressProps) {
  const { kind, pubkey, identifier } = useMemo(() => {
    const [k, pubkey, identifier] = address.split(":");
    return { kind: Number(k), pubkey, identifier };
  }, [address]);
  return (
    <NAddr
      kind={kind}
      pubkey={pubkey}
      identifier={identifier}
      relays={[]}
      components={components}
    />
  );
}
