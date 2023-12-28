import { useQuery, useQueries, UseQueryResult } from "@tanstack/react-query";

export type RelayMetadata = Record<string, any>;

async function getRelayMetadata(url: string) {
  try {
    const relayUrl = new URL(url);
    const isSecure = url.startsWith("wss://");
    const relayInfoUrl = `${isSecure ? "https" : "http"}://${relayUrl.host}${
      relayUrl.pathname
    }`;
    return await fetch(relayInfoUrl, {
      headers: {
        Accept: "application/nostr+json",
      },
    }).then((res) => res.json());
  } catch (error) {
    console.error(`Couldn't fetch NIP-11 metadata for ${url}`);
  }
}

export function useRelayMetadata(
  url: string,
): UseQueryResult<RelayMetadata, any> {
  return useQuery({
    queryKey: ["relay-metadata", url],
    queryFn: () => getRelayMetadata(url),
    retry: false,
    retryOnMount: false,
  });
}

export function useRelaysMetadata(urls: string[]) {
  return useQueries({
    queries: urls.map((url) => {
      return {
        queryKey: ["relay-metadata", url],
        queryFn: () => getRelayMetadata(url),
        retry: false,
        retryOnMount: false,
      };
    }),
  });
}
