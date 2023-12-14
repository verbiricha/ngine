import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Stack,
  HStack,
  Icon,
  Text,
  Button,
} from "@chakra-ui/react";
import { useIntl, FormattedMessage } from "react-intl";

import User from "./User";
import Username from "./Username";
import Event from "./Event";
import { useSession } from "../state";
import { useSigner } from "../context";
import useFeedback from "../hooks/useFeedback";
import { EventProps } from "../types";
import { Repost as RepostIcon } from "../icons";

interface RepostProps extends EventProps {
  author: string;
}

export function Repost({ author, ...props }: RepostProps) {
  return (
    <Stack>
      <HStack align="center">
        <Icon as={RepostIcon} boxSize={4} />
        <Username pubkey={author} />
      </HStack>
      <Event {...props} />
    </Stack>
  );
}

interface RepostModalProps extends EventProps {
  isOpen: boolean;
  onClose(): void;
}

export default function RepostModal({
  event,
  isOpen,
  onClose,
  components,
}: RepostModalProps) {
  const session = useSession();
  const canSign = useSigner();
  const [isBusy, setIsBusy] = useState(false);
  const toast = useFeedback();
  const { formatMessage } = useIntl();

  async function onRepost() {
    try {
      setIsBusy(true);
      await event.repost();
      toast.success(
        formatMessage({
          id: "ngine.repost-success",
          description: "Repost success message",
          defaultMessage: "Reposted",
        }),
      );
      onClose();
    } catch (e) {
      const msg = formatMessage({
        id: "ngine.repost-error",
        description: "Repost error message",
        defaultMessage: "Couldn't repost",
      });
      toast.error((e as Error)?.message, msg);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <FormattedMessage
              id="ngine.reposting"
              description="Repost modal title"
              defaultMessage="Repost"
            />
            <User pubkey={event.pubkey} />
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {canSign && (
            <Repost
              author={session.pubkey}
              event={event}
              components={components}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={!canSign}
            isLoading={isBusy}
            variant="solid"
            colorScheme="brand"
            onClick={onRepost}
          >
            <FormattedMessage
              id="ngine.repost"
              description="Repost button"
              defaultMessage="Repost"
            />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
