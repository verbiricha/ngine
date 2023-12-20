import useEvents from "./useEvents";
import { addressesToFilter } from "../filter";

export default function useAddresses(addresses: string[]) {
  return useEvents(addressesToFilter(addresses));
}
