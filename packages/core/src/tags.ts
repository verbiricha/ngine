import { NDKEvent } from "@nostr-dev-kit/ndk";

export function tagValues(ev: NDKEvent, tag: string): string[] {
  return ev.tags.filter((t) => t[0] === tag).map((t) => t[1]);
}
