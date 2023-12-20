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

export function getRarity(id: string) {
  const pow = nip13.getPow(id);

  if (pow > 64) {
    return Rarities.Legendary;
  }

  if (pow > 32) {
    return Rarities.Epic;
  }

  if (pow > 16) {
    return Rarities.SuperRare;
  }

  if (pow > 8) {
    return Rarities.Rare;
  }

  return Rarities.Normal;
}

export function rarityName(r: Rarities) {
  return rarityNames[r];
}
