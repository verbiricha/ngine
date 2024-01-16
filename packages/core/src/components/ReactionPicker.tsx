import { useState, useEffect } from "react";
import {
  useColorMode,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Stack,
  Image,
  HStack,
  Button,
} from "@chakra-ui/react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useIntl, FormattedMessage } from "react-intl";
import { useQuery } from "@tanstack/react-query";
import NDK, {
  NDKEvent,
  NDKKind,
  NDKFilter,
  NostrEvent,
} from "@nostr-dev-kit/ndk";

import User from "./User";
import Emoji from "./Emoji";
import { useNDK, useSigner, useSign } from "../context";
import { useSession } from "../state";
import { defaultOptions } from "../hooks/useFeedback";
import useLatestEvent from "../hooks/useLatestEvent";
import { EventProps, Tag } from "../types";
import { tagValues } from "../tags";
import { unixNow } from "../time";
import { addressesToFilter } from "../filter";

interface ReactionPickerProps extends EventProps {
  isOpen: boolean;
  onClose(): void;
  pubkey: string;
}

interface ReactionEmoji {
  id: string;
  native?: string;
  shortcodes: string;
  src?: string;
}

interface CustomEmoji {
  id: string;
  name: string;
  skins: { src: string }[];
}

interface EmojiCollection {
  id: string;
  name: string;
  emojis: CustomEmoji[];
}

function tagToCustomEmoji(t: Tag): CustomEmoji {
  const [_, shortcode, src] = t;
  const name = shortcode.replace(" ", "_");
  return {
    id: shortcode,
    name,
    skins: [{ src }],
  };
}

function eventToEmojiCollection(ev: NDKEvent): EmojiCollection {
  return {
    id: ev.tagId(),
    name: ev.tagValue("d"),
    emojis: ev.tags.filter((t) => t[0] === "emoji").map(tagToCustomEmoji),
  };
}

async function getCustomEmoji(ndk: NDK, emojiList: NDKEvent) {
  const generalEmoji = emojiList ? tagValues(emojiList, "emoji") : [];
  const general =
    generalEmoji.length > 0
      ? {
          id: emojiList.tagId(),
          name: "General",
          emojis: generalEmoji.map(tagToCustomEmoji),
        }
      : null;
  const addresses = tagValues(emojiList, "a").filter((a) =>
    a.startsWith(`${NDKKind.EmojiSet}`),
  );
  if (addresses.length === 0) {
    return [];
  }
  const filter = addressesToFilter(addresses);
  const emojiCollections = await ndk.fetchEvents(filter);
  const custom = [...emojiCollections].map(eventToEmojiCollection);
  return general ? [general, ...custom] : custom;
}

function useCustomEmoji(emojiList?: NDKEvent) {
  const ndk = useNDK();
  const query = useQuery({
    queryKey: ["emojis", emojiList ? emojiList.id : "none"],
    queryFn: () => getCustomEmoji(ndk, emojiList),
  });
  return query.data;
}

function EmojiPreview({ emoji }: { emoji: ReactionEmoji }) {
  if (emoji.native) {
    return <Text fontSize="md">{emoji.native}</Text>;
  }

  return <Emoji alt={emoji.name} src={emoji.src} />;
}

export default function ReactionPicker({
  event,
  isOpen,
  onClose,
  pubkey,
}: ReactionPickerProps) {
  const ndk = useNDK();
  const { locale, formatMessage } = useIntl();
  const [isBusy, setIsBusy] = useState(false);
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [emoji, setEmoji] = useState<ReactionEmoji>({ native: "❤️" });
  const session = useSession();
  const canSign = useSigner();
  const sign = useSign();
  const emojiList = useLatestEvent({
    kinds: [NDKKind.EmojiList],
    authors: [session?.pubkey],
  });
  const customEmoji = useCustomEmoji(emojiList);

  async function onEmojiSelect(e: ReactionEmoji) {
    setEmoji(e);
  }

  async function onReaction() {
    try {
      setIsBusy(true);
      if (emoji.native) {
        await event.react(emoji.native);
        const msg = formatMessage(
          {
            id: "ngine.react-success-native",
            description: "Success message for reactions",
            defaultMessage: "Reacted with { emoji }",
          },
          { emoji: emoji.native },
        );
        toast({
          status: "success",
          title: msg,
          ...defaultOptions,
        });
      } else {
        // todo: refactor useFeedback to allow custom render
        const reaction = {
          kind: NDKKind.Reaction,
          content: emoji.shortcodes,
          tags: [
            ["emoji", emoji.id, emoji.src],
            event.tagReference(),
            ["p", event.pubkey],
          ],
          created_at: unixNow(),
        };
        const ev = await sign(reaction);
        await ev.publish();
        toast({
          status: "success",
          render: (props) => {
            return (
              <HStack color="white" bg="green.400" p={3}>
                <FormattedMessage
                  id="ngine.react-success"
                  description="Success message for reactions"
                  defaultMessage="Reacted with"
                />
                <EmojiPreview emoji={emoji} />
              </HStack>
            );
          },
          ...defaultOptions,
        });
      }
      onClose();
    } catch (e) {
      const msg = formatMessage({
        id: "ngine.react-error",
        description: "Error message for reactions",
        defaultMessage: "Couldn't react",
      });
      toast({
        status: "error",
        title: msg,
        description: (e as Error)?.message,
        ...defaultOptions,
      });
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
            <Picker
              data={data}
              theme={colorMode}
              locale={locale}
              onEmojiSelect={onEmojiSelect}
              custom={customEmoji}
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
            <HStack>
              <FormattedMessage
                id="ngine.react-with"
                description="React with button"
                defaultMessage="React with"
              />
              <EmojiPreview emoji={emoji} />
            </HStack>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
