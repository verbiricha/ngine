import { useState, useMemo } from "react";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Stack,
  HStack,
  Text,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  CheckboxGroup,
  Checkbox,
  Switch,
} from "@chakra-ui/react";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { useIntl, FormattedMessage } from "react-intl";

import User from "./User";
import Event from "./Event";
import { useNDK, useSigner } from "../context";
import { useSession } from "../state";
import useFeedback from "../hooks/useFeedback";
import { unixNow } from "../time";
import { tagValues } from "../tags";
import { EventProps } from "../types";

interface ReplyModalProps extends EventProps {
  isOpen: boolean;
  onClose(): void;
}

// todo: quote with mention marker
// todo: explicitly add hashtags
export default function ReplyModal({
  event,
  isOpen,
  onClose,
  components,
}: ReplyModalProps) {
  const ndk = useNDK();
  const { formatMessage } = useIntl();
  const session = useSession();
  const canSign = useSigner();
  const toast = useFeedback();
  const [isBusy, setIsBusy] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [comment, setComment] = useState("");
  // fixme: not always all selected by default
  const pTags = useMemo(() => {
    return [
      event.pubkey,
      ...new Set(tagValues(event, "p").filter((pk) => pk !== event.pubkey)),
    ];
  }, [event]);
  const root = useMemo(() => {
    const rootTag = event.tags.find((t) => t[3] === "root");
    if (rootTag) {
      return rootTag[1];
    }
    return null;
  }, [event]);
  const isReply = useMemo(() => {
    return event.tags.find(
      (t) => t[0] === "e" && ["root", "mention", "reply"].includes(t[3]),
    );
  }, [event]);
  const [tagged, setTagged] = useState(pTags);
  const noteEvent = useMemo(() => {
    return new NDKEvent(ndk, {
      kind: NDKKind.Text,
      content: comment,
      created_at: unixNow(),
      tags: [
        ...(root ? [["e", root, event.relay?.url || "", "root"]] : []),
        ...(isReply ? [["e", event.id, event.relay?.url || "", "reply"]] : []),
        ...(!root && !isReply
          ? [["e", event.id, event.relay?.url || "", "root"]]
          : []),
        ...tagged.map((pk) => ["p", pk]),
      ],
      pubkey: session?.pubkey || "",
    });
  }, [event, comment, tagged, root, session]);

  async function replyEvent() {
    await noteEvent.sign();
    return noteEvent;
  }

  function closeModal() {
    setTagged(pTags);
    setComment("");
    setIsPreview(false);
    setIsBusy(false);
    onClose();
  }

  async function onReply() {
    try {
      setIsBusy(true);
      const ev = await replyEvent();
      await ev.publish();
      const msg = formatMessage({
        id: "ngine.reply-success",
        description: "Reply success message",
        defaultMessage: "Replied",
      });
      toast.success(msg);
      closeModal();
    } catch (e) {
      const msg = formatMessage({
        id: "ngine.reply-error",
        description: "Reply error message",
        defaultMessage: "Unable to reply",
      });
      toast.error((e as Error)?.message, msg);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <FormattedMessage
              id="ngine.replying-to"
              description="Reply modal title"
              defaultMessage="Replying to"
            />
            <User pubkey={event.pubkey} />
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack>
            <Box maxH="320px" overflow="scroll">
              <Event
                key={event.id}
                event={event}
                reactionKinds={[]}
                components={components}
              />
            </Box>
            {isPreview ? (
              <Event
                event={noteEvent}
                reactionKinds={[]}
                components={components}
              />
            ) : (
              <>
                <FormControl>
                  <FormLabel>
                    <FormattedMessage
                      id="ngine.comment-label"
                      description="Comment field label"
                      defaultMessage="Comment"
                    />
                  </FormLabel>
                  <Textarea
                    placeholder={formatMessage({
                      id: "ngine.comment-placeholder",
                      description: "Comment field placeholder",
                      defaultMessage: "Type your reply here",
                    })}
                    value={comment}
                    onChange={(ev) => setComment(ev.target.value)}
                  />
                </FormControl>
                {pTags.length > 1 && (
                  <FormControl>
                    <FormLabel>Reply to</FormLabel>
                    <CheckboxGroup
                      value={tagged}
                      colorScheme="brand"
                      // @ts-ignore
                      onChange={setTagged}
                    >
                      <Stack direction={["column", "row"]} wrap="wrap">
                        {pTags.map((pk) => (
                          <Checkbox key={pk} value={pk}>
                            <User size="xs" fontSize="sm" pubkey={pk} />
                          </Checkbox>
                        ))}
                      </Stack>
                    </CheckboxGroup>
                  </FormControl>
                )}
              </>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <HStack w="100%" justify="space-between">
            <FormControl alignItems="center" display="flex">
              <FormLabel mb={0} htmlFor="enable-preview">
                <FormattedMessage
                  id="ngine.preview"
                  description="Preview post switch"
                  defaultMessage="Preview"
                />
              </FormLabel>
              <Switch
                id="enable-preview"
                isChecked={isPreview}
                onChange={(ev) => setIsPreview(ev.target.checked)}
                size="sm"
                colorScheme="brand"
              />
            </FormControl>
            <Button
              isDisabled={!canSign || comment.trim().length === 0}
              isLoading={isBusy}
              variant="solid"
              colorScheme="brand"
              onClick={onReply}
            >
              <FormattedMessage
                id="ngine.reply"
                description="Reply button"
                defaultMessage="Reply"
              />
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
