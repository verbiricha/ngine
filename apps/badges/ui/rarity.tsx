import { nip13 } from "nostr-tools";

export default function Rarity({ event }) {
  const pow = nip13.getPow(event.id);
  console.log("POW", pow);
  return null;
}
