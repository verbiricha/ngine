"use client";

import { useMemo } from "react";
import { Flex, Skeleton } from "@chakra-ui/react";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { useEvent, User, Event, EventProps } from "@ngine/core";
import { nip19 } from "nostr-tools";

import Badge from "./badge";

function BadgeDefinition({ event }: EventProps) {
  return <Badge event={event} showAwards={true} linkToBadge={false} />;
}

interface AddressProps {
  naddr: string;
}

export default function Address({ naddr }: AddressProps) {
  const address = useMemo(() => {
    try {
      const decoded = nip19.decode(naddr);
      if (decoded.type === "naddr") {
        return decoded.data;
      }
    } catch (error) {
      console.error(error);
    }
  }, [naddr]);
  const event = useEvent(
    {
      kinds: [address.kind],
      authors: [address.pubkey],
      "#d": [address.identifier],
    },
    {
      disable: !address,
    },
    address?.relays,
  );

  return event ? (
    <Event
      event={event}
      components={{ [NDKKind.BadgeDefinition]: BadgeDefinition }}
    />
  ) : (
    <Skeleton height="400px" width="320px" borderRadius="24px" />
  );
}
