import { useState } from "react";
import { IconButton } from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useIntl } from "react-intl";
import { NDKKind } from "@nostr-dev-kit/ndk";
import {
  useFeedback,
  useSign,
  useSigner,
  useRelays,
  useRelaySettings,
  unixNow,
} from "@ngine/core";

import { relayToTag } from "../utils";

function RemoveRelay({ url }: { url: string }) {
  const { formatMessage } = useIntl();
  const toast = useFeedback();
  const [isBusy, setIsBusy] = useState(false);
  const canSign = useSigner();
  const sign = useSign();
  const relays = useRelaySettings();

  async function removeRelay() {
    const ev = {
      kind: NDKKind.RelayList,
      created_at: unixNow(),
      content: "",
      tags: [...relays.filter((r) => r.url !== url).map(relayToTag)],
    };
    try {
      setIsBusy(true);
      const signed = await sign(ev);
      if (signed) {
        await signed.publish();
        toast.success(
          formatMessage(
            {
              id: "relay-removed",
              description: "Notification when removing a relay",
              defaultMessage: `Removed { url } from your relay list`,
            },
            { url },
          ),
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        formatMessage({
          id: "relay-remove-error",
          description: "Notification when failing to remove a relay",
          defaultMessage: `Could not remove { url } from your relay list`,
        }),
      );
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <IconButton
      isDisabled={!canSign}
      isLoading={isBusy}
      aria-label={formatMessage({
        id: "remove-relay",
        description: "Remove relay button label",
        defaultMessage: "Remove relay",
      })}
      icon={<DeleteIcon />}
      variant="outline"
      colorScheme="red"
      size="sm"
      onClick={removeRelay}
    />
  );
}

function AddRelay({ url }: { url: string }) {
  const { formatMessage } = useIntl();
  const [isBusy, setIsBusy] = useState(false);
  const toast = useFeedback();
  const canSign = useSigner();
  const sign = useSign();
  const relays = useRelaySettings();

  async function addRelay() {
    const ev = {
      kind: NDKKind.RelayList,
      created_at: unixNow(),
      content: "",
      tags: [["r", url], ...relays.map(relayToTag)],
    };
    try {
      setIsBusy(true);
      const signed = await sign(ev);
      if (signed) {
        await signed.publish();
        toast.success(
          formatMessage(
            {
              id: "relay-added",
              description: "Notification when adding a relay",
              defaultMessage: `Added { url } to your relay list`,
            },
            { url },
          ),
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        formatMessage({
          id: "relay-add-error",
          description: "Notification when failing to add a relay",
          defaultMessage: `Could not add { url } to your relay list`,
        }),
      );
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <IconButton
      isDisabled={!canSign}
      isLoading={isBusy}
      aria-label={formatMessage({
        id: "add-relay",
        description: "Add relay button label",
        defaultMessage: "Add relay",
      })}
      icon={<AddIcon />}
      variant="outline"
      colorScheme="brand"
      size="sm"
      onClick={addRelay}
    />
  );
}

export default function ToggleRelay({ url }: { url: string }) {
  const relays = useRelays();

  return relays.includes(url) ? (
    <RemoveRelay url={url} />
  ) : (
    <AddRelay url={url} />
  );
}
