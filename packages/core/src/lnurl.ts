import { useState, useEffect } from "react";
import { NostrEvent } from "@nostr-dev-kit/ndk";
import { useQuery, useQueries } from "@tanstack/react-query";
import { bech32 } from "bech32";
import { NDKUserProfile } from "@nostr-dev-kit/ndk";

const BECH32_MAX_BYTES = 42000;

interface LNURLService {
  nostrPubkey?: string;
  minSendable: number;
  maxSendable: number;
  metadata: string;
  callback: string;
  commentAllowed?: number;
}

export function useLnurl(profile: NDKUserProfile | null) {
  const key = profile?.lud16 ?? "none";
  const query = useQuery({
    queryKey: ["lnurl", key],
    queryFn: async () => {
      if (key === "none") {
        return null;
      }
      return loadService(key);
    },
    retry: false,
    refetchOnMount: false,
  });
  return query;
}

export function useLnurlVerify(lnurlVerifyUrl?: string) {
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    let pollingInterval: number | undefined;

    const pollLnurlPayment = async () => {
      try {
        if (lnurlVerifyUrl) {
          const response = await fetch(lnurlVerifyUrl);
          const data = await response.json();

          if (data.settled) {
            setIsPaid(true);
            clearInterval(pollingInterval);
          }
        }
      } catch (error) {
        console.error("Error polling LNURL:", error);
      }
    };

    if (lnurlVerifyUrl) {
      pollingInterval = setInterval(pollLnurlPayment, 1000);

      return () => clearInterval(pollingInterval);
    }

    return () => {};
  }, [lnurlVerifyUrl]);

  return isPaid;
}

export function useLnurls(profiles: NDKUserProfile[]) {
  const queries = profiles.map((profile) => {
    return {
      queryKey: ["lnurl", profile.lud16],
      queryFn: async () => {
        if (profile.lud16) {
          return loadService(profile.lud16);
        }
      },
    };
  });
  return useQueries({ queries });
}

function bech32ToText(str: string) {
  const decoded = bech32.decode(str, BECH32_MAX_BYTES);
  const buf = bech32.fromWords(decoded.words);
  return new TextDecoder().decode(Uint8Array.from(buf));
}

async function fetchJson<T>(url: string) {
  const rsp = await fetch(url);
  if (rsp.ok) {
    const data: T = await rsp.json();
    return data;
  }
  return null;
}

export async function loadService(
  service?: string,
): Promise<LNURLService | null> {
  if (service) {
    const isServiceUrl = service.toLowerCase().startsWith("lnurl");
    if (isServiceUrl) {
      const serviceUrl = bech32ToText(service);
      return await fetchJson(serviceUrl);
    } else {
      const ns = service.split("@");
      return await fetchJson(`https://${ns[1]}/.well-known/lnurlp/${ns[0]}`);
    }
  }
  return null;
}

export async function loadInvoice(
  payService: LNURLService,
  amount: number,
  comment?: string,
  nostr?: NostrEvent,
) {
  if (!amount || !payService) return null;

  const callback = new URL(payService.callback);
  const query = new Map<string, string>();
  if (callback.search.length > 0) {
    callback.search
      .slice(1)
      .split("&")
      .forEach((a) => {
        const pSplit = a.split("=");
        query.set(pSplit[0], pSplit[1]);
      });
  }
  query.set("amount", Math.floor(amount * 1000).toString());
  if (comment && payService?.commentAllowed) {
    query.set("comment", comment);
  }
  if (payService.nostrPubkey && nostr) {
    query.set("nostr", JSON.stringify(nostr));
  }

  const baseUrl = `${callback.protocol}//${callback.host}${callback.pathname}`;
  // @ts-ignore
  const queryJoined = [...query.entries()]
    .map((v) => `${v[0]}=${encodeURIComponent(v[1])}`)
    .join("&");
  try {
    const rsp = await fetch(`${baseUrl}?${queryJoined}`);
    if (rsp.ok) {
      const data = await rsp.json();
      if (data.status === "ERROR") {
        throw new Error(data.reason);
      } else {
        return data;
      }
    }
  } catch (e) {
    console.error(e);
  }
}
