/* eslint-disable no-restricted-globals */
import { NostrEvent, nip13 } from "nostr-tools";

addEventListener(
  "message",
  (e: MessageEvent<{ event: NostrEvent; difficulty: number }>) => {
    if (!e) return;
    const { event, difficulty } = e.data;
    console.log("FINDING POW FOR EV", event, difficulty);

    const ev = nip13.minePow(event, difficulty);

    postMessage(ev);
  },
);
