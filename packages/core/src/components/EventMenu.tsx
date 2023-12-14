import {
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
} from "@chakra-ui/react";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { useIntl, FormattedMessage } from "react-intl";

import ReactionsModal from "./ReactionsModal";
import { Copy, Dots, Brackets, Heart } from "../icons";
import useReactions, { ReactionEvents } from "../hooks/useReactions";
import useCopy from "../hooks/useCopy";
import useFeedback from "../hooks/useFeedback";

interface EventMenuProps {
  event: NDKEvent;
  kinds: NDKKind[];
  events: ReactionEvents;
}

export default function EventMenu({ event, kinds, events }: EventMenuProps) {
  const { success, error } = useFeedback();
  const { formatMessage } = useIntl();
  const copy = useCopy();
  const reactionsModal = useDisclosure();

  async function copyId() {
    try {
      await copy(`nostr:${event.encode()}`);
      success(
        formatMessage({
          id: "ngine.event-id-copy-success",
          description: "Success message for event ID copy",
          defaultMessage: "Event ID copied",
        }),
      );
    } catch (e) {
      error(
        formatMessage({
          id: "ngine.event-id-copy-error",
          description: "Error message for event ID copy",
          defaultMessage: "Couldn't copy event ID",
        }),
      );
    }
  }

  async function copyRaw() {
    try {
      const raw = event.rawEvent();
      await copy(JSON.stringify(raw, null, 2));
      success(
        formatMessage({
          id: "ngine.event-copy-success",
          description: "Success message for event JSON copy",
          defaultMessage: "Event copied",
        }),
      );
    } catch (e) {
      error(
        formatMessage({
          id: "ngine.event-json-copy-error",
          description: "Error message for event JSON copy",
          defaultMessage: "Couldn't copy event",
        }),
      );
    }
  }

  return (
    <>
      <Menu>
        <MenuButton>
          <Icon as={Dots} boxSize={5} color="gray.400" />
        </MenuButton>
        <MenuList>
          <MenuItem icon={<Icon as={Heart} />} onClick={reactionsModal.onOpen}>
            <FormattedMessage
              id="ngine.menu-reactions"
              description="Reactions dialog opener"
              defaultMessage="Reactions"
            />
          </MenuItem>
          <MenuItem icon={<Icon as={Copy} />} onClick={copyId}>
            <FormattedMessage
              id="ngine.copy-id"
              description="Copy event ID"
              defaultMessage="Copy ID"
            />
          </MenuItem>
          <MenuItem icon={<Icon as={Brackets} />} onClick={copyRaw}>
            <FormattedMessage
              id="ngine.copy-json"
              description="Copy event JSON"
              defaultMessage="Copy JSON"
            />
          </MenuItem>
        </MenuList>
      </Menu>
      <ReactionsModal kinds={kinds} events={events} {...reactionsModal} />
    </>
  );
}
