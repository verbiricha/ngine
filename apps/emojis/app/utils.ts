import { Relay, Tag } from "@ngine/core";

export function encodeRelayURL(url: string): string {
  url = url.trim();
  if (url.startsWith("wss://")) {
    url = url.slice(6);
  }
  return encodeURIComponent(url);
}

export function relayToTag(r: Relay): Tag {
  if (r.read && !r.write) {
    return ["r", r.url, "read"];
  }
  if (r.write && !r.read) {
    return ["r", r.url, "write"];
  }
  return ["r", r.url];
}

export function tagToRelay(t: Tag): Relay {
  const url = t[1].replace(/\/$/, "");

  if (t[2] === "read") {
    return { url, read: true, write: false };
  }

  if (t[2] === "write") {
    return { url, read: false, write: true };
  }

  return { url, read: true, write: true };
}
