interface Section {
  name: string;
  letters: string;
  value: Record<string, any>;
}

interface DecodedLightningInvoice {
  paymentRequest: string;
  sections: Section[];
}

declare module "light-bolt11-decoder" {
  export function decode(pr: string): DecodedLightningInvoice;
}
