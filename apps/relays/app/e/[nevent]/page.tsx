"use client";

import { useMemo } from "react";
import { Alert, AlertIcon } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { nip19 } from "nostr-tools";

import Event from "../../components/event";
import Layout from "../../components/layout";

export default function EventPage({ params }: { params: { nevent: string } }) {
  const { nevent } = params;
  const event = useMemo(() => {
    try {
      const decoded = nip19.decode(nevent);
      if (decoded.type === "nevent") {
        return decoded.data;
      }
      if (decoded.type === "note") {
        return { id: decoded.data, relays: [] };
      }
    } catch (error) {
      console.error(error);
    }
  }, [nevent]);

  return (
    <Layout>
      {event ? (
        <Event {...event} />
      ) : (
        <Alert status="error">
          <AlertIcon />
          <FormattedMessage
            id="bad-event"
            description="Error message when failing to decode an event"
            defaultMessage="Could not decode event ID"
          />
        </Alert>
      )}
    </Layout>
  );
}
