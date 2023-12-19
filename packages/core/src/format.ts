import type { Currency, Rates } from "./types";

export function formatSats(n: number) {
  const intl = new Intl.NumberFormat("en", {
    minimumFractionDigits: 0,
    maximumFractionDigits: n < 1e8 ? 2 : 8,
  });

  if (n === 1) {
    return `1`;
  } else if (n < 2e3) {
    return `${n}`;
  } else if (n < 1e6) {
    return `${intl.format(n / 1e3)}K`;
  } else if (n < 1e9) {
    return `${intl.format(n / 1e6)}M`;
  } else {
    return `${intl.format(n / 1e8)}BTC`;
  }
}

export function formatSatAmount(n: number, currency: Currency, rates: Rates) {
  const intl = new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  });
  const amount = (n / 1e8) * rates.ask;
  return intl.format(amount);
}

export function formatRelativeTime(timestamp: number) {
  const now = Math.floor(Date.now() / 1000);
  const elapsed = now - timestamp;

  if (elapsed < 60) {
    return `${elapsed} second${elapsed !== 1 ? "s" : ""} ago`;
  } else if (elapsed < 3600) {
    const minutes = Math.floor(elapsed / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (elapsed < 86400) {
    const hours = Math.floor(elapsed / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(elapsed / 86400);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }
}
