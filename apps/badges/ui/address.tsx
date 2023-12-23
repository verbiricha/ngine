"use client";

import { useMemo } from "react";
import { Flex, Skeleton, Alert, AlertIcon } from "@chakra-ui/react";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { useEvent, User, Event, EventProps } from "@ngine/core";
import { nip19 } from "nostr-tools";

import Badge from "./badge";

function BadgeDefinition({ event }: EventProps) {
  return (
    <>
      <Badge event={event} showDetails={true} linkToBadge={false} />
    </>
  );
}

interface BadgeAddressProps {
  kind: number;
  pubkey: string;
  identifier: string;
  relays?: string[];
}

function BadgeAddress({ kind, pubkey, identifier, relays }: BadgeAddressProps) {
  const event = useEvent(
    {
      kinds: [kind],
      authors: [pubkey],
      "#d": [identifier],
    },
    {},
    relays,
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
  return address ? (
    <BadgeAddress {...address} />
  ) : (
    <Alert status="error">
      <AlertIcon />
      Couldn't decode badge address
    </Alert>
  );
}
