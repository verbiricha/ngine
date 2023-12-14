import { useState, useEffect } from "react";
import {
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Stack,
  HStack,
  Button,
} from "@chakra-ui/react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useIntl, FormattedMessage } from "react-intl";

import User from "./User";
import { useSigner } from "../context";
import { useSession } from "../state";
import useFeedback from "../hooks/useFeedback";
import { EventProps } from "../types";

interface ReactionPickerProps extends EventProps {
  isOpen: boolean;
  onClose(): void;
}

interface Emoji {
  native: string;
}

export default function ReactionPicker({
  event,
  isOpen,
  onClose,
}: ReactionPickerProps) {
  const { locale, formatMessage } = useIntl();
  const [isBusy, setIsBusy] = useState(false);
  const { colorMode } = useColorMode();
  const toast = useFeedback();
  const [emoji, setEmoji] = useState("❤️");
  const session = useSession();
  const canSign = useSigner();

  async function onEmojiSelect({ native }: Emoji) {
    setEmoji(native);
  }

  async function onReaction() {
    try {
      setIsBusy(true);
      await event.react(emoji);
      const msg = formatMessage(
        {
          id: "ngine.react-success",
          description: "Success message for reactions",
          defaultMessage: "Reacted with { emoji }",
        },
        { emoji },
      );
      toast.success(msg);
      onClose();
    } catch (e) {
      const msg = formatMessage({
        id: "ngine.react-error",
        description: "Error message for reactions",
        defaultMessage: "Couldn't react",
      });
      toast.error((e as Error)?.message, msg);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <FormattedMessage
              id="ngine.react-to"
              description="React modal title"
              defaultMessage="Reacting to"
            />
            <User pubkey={event.pubkey} />
          </HStack>
        </ModalHeader>
        <ModalBody>
          <Stack align="center" justify="center">
            <Text fontSize="4xl">{emoji}</Text>
            <Picker
              data={data}
              theme={colorMode}
              locale={locale}
              onEmojiSelect={onEmojiSelect}
            />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={!canSign}
            isLoading={isBusy}
            variant="solid"
            colorScheme="brand"
            onClick={onReaction}
          >
            <FormattedMessage
              id="ngine.react-with"
              description="React with button"
              defaultMessage="React with { emoji }"
              values={{ emoji }}
            />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
