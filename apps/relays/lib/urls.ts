export function encode(url: string): string {
  url = url.trim();
  return encodeURIComponent(humanize(url));
}

export function humanize(url: string) {
  return url.replace("ws://", "").replace("wss://", "").replace(/\/$/, "");
}
