import Event from "./Event";
import Placeholder from "./Placeholder";
import { EventProps, Components } from "../types";
import useEvent from "../hooks/useEvent";

interface NEventProps extends Omit<EventProps, "event"> {
  id: string;
  relays?: string[];
}

export default function NEvent({ id, relays, ...props }: NEventProps) {
  const event = useEvent(
    {
      ids: [id],
    },
    {},
    relays,
  );
  return event ? <Event event={event} {...props} /> : <Placeholder />;
}
