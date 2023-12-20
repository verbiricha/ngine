import { useMemo } from "react";

import Event from "./Event";
import Placeholder from "./Placeholder";
import { EventProps } from "../types";

interface AddressProps extends EventProps {
  address: string;
}

export default function Address({ address, ...props }: AddressProps) {
  const event = useAddress(address);
  return event ? <Event event={event} {...props} /> : <Placeholder />;
}
