import { sha256 } from "@noble/hashes/sha256";

interface HasPubkey {
  pubkey: string;
}

export function dedupeByPubkey<T extends HasPubkey>(evs: T[]): T[] {
  return evs.reduce(
    (acc, ev) => {
      if (acc.seen.has(ev.pubkey)) {
        return acc;
      }
      acc.seen.add(ev.pubkey);
      acc.result.push(ev);
      return acc;
    },
    {
      seen: new Set([]) as Set<string>,
      result: [] as T[],
    },
  ).result;
}

export function dedupe<T>(evs: T[]): T[] {
  return evs.reduce(
    (acc, ev) => {
      if (acc.seen.has(ev)) {
        return acc;
      }
      acc.seen.add(ev);
      acc.result.push(ev);
      return acc;
    },
    {
      seen: new Set([]) as Set<T>,
      result: [] as T[],
    },
  ).result;
}

export function parseJSON<T>(raw: string, def: T) {
  try {
    return JSON.parse(raw);
  } catch (e) {
    return def;
  }
}

interface MyObject {
  [key: string]: any;
}

export function hashSha256(obj: MyObject): string {
  const jsonString = JSON.stringify(obj);

  const hashBuffer = sha256(new TextEncoder().encode(jsonString));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}
