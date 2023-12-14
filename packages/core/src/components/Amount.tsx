import { useExchangeRate, useCurrency } from "../state";
import { formatSats, formatSatAmount } from "../format";
import type { Currency } from "../types";

interface AmountProps {
  amount: number;
  currency?: Currency;
}

export default function Amount({ amount, currency }: AmountProps) {
  const defaultCurrency = useCurrency();
  const selectedCurrency = currency || defaultCurrency;
  const rates = useExchangeRate(selectedCurrency);

  if (!rates) {
    return <>{formatSats(amount)}</>;
  }

  return <>{formatSatAmount(amount, selectedCurrency, rates)}</>;
}
