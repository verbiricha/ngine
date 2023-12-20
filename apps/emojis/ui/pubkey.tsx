"use client";

import { FormattedMessage } from "react-intl";
import { Alert, AlertIcon } from "@chakra-ui/react";

import Profile from "./profile";

export default function Pubkey({ pubkey }: { pubkey?: string }) {
  return pubkey ? (
    <Profile pubkey={pubkey} />
  ) : (
    <Alert>
      <AlertIcon />
      <FormattedMessage
        id="bad-npub"
        description="Error shown when failing to decode npub"
        defaultMessage="Could not decode npub"
      />
    </Alert>
  );
}
