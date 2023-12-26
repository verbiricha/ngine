import { NDKSubscriptionOptions } from "@nostr-dev-kit/ndk";
import useEvents, { SubscriptionOptions } from "./useEvents";
import { addressesToFilter } from "../filter";

export default function useAddresses(
  addresses: string[],
  opts?: SubscriptionOptions,
  relays?: string[],
) {
  return useEvents(addressesToFilter(addresses), opts, relays);
}
