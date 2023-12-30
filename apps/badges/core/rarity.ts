import { nip13 } from "nostr-tools";

export enum Rarities {
  Normal = "Normal",
  Rare = "Rare",
  SuperRare = "Super Rare",
  Epic = "Epic",
  Legendary = "Legendary",
}

const rarityNames = {
  [Rarities.Normal]: "Normal",
  [Rarities.Rare]: "Rare",
  [Rarities.SuperRare]: "Super Rare",
  [Rarities.Epic]: "Epic",
  [Rarities.Legendary]: "Legendary",
};

export function getPow(id: string) {
  return nip13.getPow(id);
}

const LEGENDARY = 42;
const EPIC = 32;
const SUPER_RARE = 21;
const RARE = 12;

export function getMinPow(r: Rarities): number {
  if (r === Rarities.Legendary) {
    return LEGENDARY;
  }
  if (r === Rarities.SuperRare) {
    return SUPER_RARE;
  }
  if (r === Rarities.Epic) {
    return EPIC;
  }
  if (r === Rarities.Rare) {
    return RARE;
  }
  return 0;
}

export function getRarity(id: string) {
  const pow = nip13.getPow(id);

  if (pow >= LEGENDARY) {
    return Rarities.Legendary;
  }

  if (pow >= EPIC) {
    return Rarities.Epic;
  }

  if (pow >= SUPER_RARE) {
    return Rarities.SuperRare;
  }

  if (pow >= RARE) {
    return Rarities.Rare;
  }

  return Rarities.Normal;
}

export function rarityName(r: Rarities) {
  return rarityNames[r];
}
