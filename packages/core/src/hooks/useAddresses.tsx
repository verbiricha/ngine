import { NDKSubscriptionOptions } from "@nostr-dev-kit/ndk";
import useEvents from "./useEvents";
import { addressesToFilter } from "../filter";

export default function useAddresses(
  addresses: string[],
  opts: NDKSubscriptionOptions,
  relays?: string[],
) {
  return useEvents(addressesToFilter(addresses), opts, relays);
}
