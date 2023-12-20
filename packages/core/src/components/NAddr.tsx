import Event from "./Event";
import Placeholder from "./Placeholder";
import { Components } from "../types";
import useEvent from "../hooks/useEvent";

interface NAddrProps {
  identifier: string;
  kind: number;
  pubkey: string;
  components?: Components;
  relays: string[];
}

export default function NAddr({
  identifier,
  kind,
  pubkey,
  relays,
  components,
}: NAddrProps) {
  const event = useEvent(
    {
      kinds: [kind],
      authors: [pubkey],
      "#d": [identifier],
    },
    {},
    relays,
  );
  return event ? (
    <Event event={event} components={components} />
  ) : (
    <Placeholder />
  );
}
