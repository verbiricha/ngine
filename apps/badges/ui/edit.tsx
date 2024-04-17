"use client";

import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import EditBadge from "@ui/edit-badge";
import useNaddr from "@hooks/useNaddr";
import { useSession, useSigner } from "@ngine/core";

export default function EditPage({ naddr }: { naddr: string }) {
  const session = useSession();
  const canSign = useSigner();
  const event = useNaddr(naddr);

  if (event && event.pubkey !== session?.pubkey) {
    return canSign ? (
      <Alert status="error">
        <AlertIcon />
        Can't edit other people's badges
      </Alert>
    ) : (
      <Alert status="error">
        <AlertIcon />
        Can't sign
      </Alert>
    );
  }

  return event ? <EditBadge event={event} /> : <Spinner />;
}
