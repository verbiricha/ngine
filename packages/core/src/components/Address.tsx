import { useMemo } from "react";

import Event from "./Event";
import Placeholder from "./Placeholder";
import { EventProps } from "../types";
import useAddress from "../hooks/useAddress";

interface AddressProps extends Omit<EventProps, "event"> {
  address: string;
}

export default function Address({ address, ...props }: AddressProps) {
  const event = useAddress(address);
  return event ? <Event event={event} {...props} /> : <Placeholder />;
}
