import type { ReactNode } from "react";
import {
  useColorModeValue,
  useDisclosure,
  As,
  Box,
  Flex,
  FlexProps,
  HStack,
  StackProps,
  Text,
  Icon,
} from "@chakra-ui/react";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { useInView } from "react-intersection-observer";

import Emoji from "./Emoji";
import Amount from "./Amount";
import EventMenu from "./EventMenu";
import RepostModal from "./RepostModal";
import ReplyModal from "./ReplyModal";
import { ReactionIcon } from "./Reaction";
import ReactionPicker from "./ReactionPicker";
import ZapModal from "./ZapModal";
import { useSession } from "../state";
import { useNDK, useSigner, useSign } from "../context";
import { EventProps, ReactionKind } from "../types";
import { unixNow } from "../time";
import { Zap, Heart, Reply, Repost, Bookmark } from "../icons";
import { ZapRequest } from "../nostr/nip57";
import { BOOKMARKS, REPOSTS } from "../nostr/kinds";
import useReactions, { ReactionEvents } from "../hooks/useReactions";

const defaultReactions: ReactionKind[] = [NDKKind.Zap, NDKKind.Reaction];

interface ReactionCountProps extends FlexProps {
  icon: As;
  count: ReactNode;
  reaction?: NDKEvent | ZapRequest;
}

function ReactionCount({ icon, count, reaction, ...rest }: ReactionCountProps) {
  const emoji = reaction?.kind === NDKKind.Reaction ? reaction.content : null;
  const hasReacted = Boolean(reaction);
  const highlighted = useColorModeValue("brand.500", "brand.100");
  const customEmoji = reaction?.tags.find(
    (t) =>
      emoji &&
      t[0] === "emoji" &&
      t[1] === `${emoji.slice(1, emoji?.length - 1)}`,
  );
  return (
    <Flex align="center" gap={2} direction="row" {...rest} wrap="wrap">
      {customEmoji ? (
        <Emoji alt={customEmoji[1]} src={customEmoji[2]} mb={0} />
      ) : emoji && !["+", "-"].includes(emoji) ? (
        <Text fontSize="xs">{emoji}</Text>
      ) : (
        <Icon as={icon} color={hasReacted ? highlighted : "currentColor"} />
      )}
      <Text color={hasReacted ? highlighted : undefined} userSelect="none">
        {count}
      </Text>
    </Flex>
  );
}

interface ReactionCountsProps extends EventProps, StackProps {
  kinds: ReactionKind[];
  events: ReactionEvents;
  bookmarkList?: number;
}

// todo: bookmark, parameterisable bookmark kind and bookmark list
export function ReactionCounts({
  event,
  kinds,
  components,
  events,
  bookmarkList = NDKKind.BookmarkList,
  ...rest
}: ReactionCountsProps) {
  const zapModal = useDisclosure();
  const repostModal = useDisclosure();
  const reactionModal = useDisclosure();
  const replyModal = useDisclosure();
  const session = useSession();
  const pubkey = session?.pubkey;
  const ndk = useNDK();
  const canSign = useSigner();
  const sign = useSign();
  const { zaps, reactions, replies, reposts, bookmarks } = events;
  const { zapRequests, total } = zaps;
  const hasBookmarks = kinds.some((k) => BOOKMARKS.includes(k));
  const hasReposts = kinds.includes(NDKKind.Repost);

  async function bookmarkEvent() {
    if (pubkey) {
      try {
        const bookmarks = await ndk.fetchEvent({
          kinds: [bookmarkList],
          authors: [pubkey],
        });
        const newBookmarks = {
          kind: bookmarkList,
          tags: bookmarks
            ? bookmarks.tags.concat([event.tagReference()])
            : [event.tagReference()],
          content: bookmarks?.content || "",
          created_at: unixNow(),
        };
        const ev = await sign(newBookmarks);
        if (ev) {
          await ev.publish();
        }
        // todo: toast
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <HStack color="chakra-subtle-text" fontSize="sm" spacing={5} {...rest}>
      {kinds
        .filter((k) =>
          hasBookmarks ? k !== NDKKind.CategorizedBookmarkList : true,
        )
        .filter((k) => (hasReposts ? k !== NDKKind.GenericRepost : true))
        .map((k) => {
          if (k === NDKKind.Text) {
            const reaction = replies.find((ev) => ev.pubkey === pubkey);
            return (
              <Box key={k}>
                <ReactionCount
                  icon={Reply}
                  count={replies.length}
                  reaction={reaction}
                  onClick={canSign ? replyModal.onOpen : undefined}
                  cursor={canSign ? "pointer" : "auto"}
                />
                {replyModal.isOpen && (
                  <ReplyModal
                    event={event}
                    components={components}
                    {...replyModal}
                  />
                )}
              </Box>
            );
          } else if (k === NDKKind.Zap) {
            const reaction = zapRequests.find((r) => r.pubkey === pubkey);
            return (
              <Box key={k}>
                <ReactionCount
                  icon={Zap}
                  count={<Amount amount={total} />}
                  reaction={reaction}
                  onClick={zapModal.onOpen}
                  cursor="pointer"
                />
                {zapModal.isOpen && (
                  <ZapModal pubkey={event.pubkey} event={event} {...zapModal} />
                )}
              </Box>
            );
          } else if (k === NDKKind.Reaction) {
            const reaction = reactions.find((r) => r.pubkey === pubkey);
            return (
              <Box key={k}>
                <ReactionCount
                  icon={Heart}
                  count={reactions.length}
                  reaction={reaction}
                  onClick={canSign ? reactionModal.onOpen : undefined}
                  cursor={canSign ? "pointer" : "auto"}
                />
                {reactionModal.isOpen && session?.pubkey && (
                  <ReactionPicker
                    event={event}
                    components={components}
                    pubkey={session.pubkey}
                    {...reactionModal}
                  />
                )}
              </Box>
            );
          } else if (REPOSTS.includes(k)) {
            const repost = reposts.find((r) => r.pubkey === pubkey);
            return (
              <Box key={k}>
                <ReactionCount
                  icon={Repost}
                  count={reposts.length}
                  reaction={repost}
                  onClick={canSign ? repostModal.onOpen : undefined}
                  cursor={canSign ? "pointer" : "auto"}
                />
                {repostModal.isOpen && (
                  <RepostModal
                    event={event}
                    components={components}
                    {...repostModal}
                  />
                )}
              </Box>
            );
          } else if (BOOKMARKS.includes(k)) {
            const bookmark = bookmarks.find((r) => r.pubkey === pubkey);
            const canBookmark = canSign && !bookmark;
            return (
              <Box key={k}>
                <ReactionCount
                  icon={Bookmark}
                  count={bookmarks.length}
                  reaction={bookmark}
                  onClick={canBookmark ? bookmarkEvent : undefined}
                  cursor={canBookmark ? "pointer" : "auto"}
                />
              </Box>
            );
          }
        })}
    </HStack>
  );
}

interface ReactionsProps extends EventProps {
  kinds?: ReactionKind[];
  bookmarkList?: number;
}

export default function Reactions({
  event,
  kinds = defaultReactions,
  bookmarkList = NDKKind.BookmarkList,
  ...props
}: ReactionsProps) {
  const { ref, inView } = useInView({
    threshold: 0,
    initialInView: false,
    rootMargin: "120px 0px",
  });
  const events = useReactions(event, kinds, inView);

  return (
    <HStack w="100%" align="center" justifyContent="space-between" ref={ref}>
      <ReactionCounts
        event={event}
        kinds={kinds}
        events={events}
        bookmarkList={bookmarkList}
        {...props}
      />
      <EventMenu event={event} kinds={kinds} events={events} />
    </HStack>
  );
}
