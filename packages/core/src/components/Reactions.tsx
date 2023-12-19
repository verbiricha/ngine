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
  Image,
} from "@chakra-ui/react";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { useInView } from "react-intersection-observer";

import Amount from "./Amount";
import EventMenu from "./EventMenu";
import RepostModal from "./RepostModal";
import ReplyModal from "./ReplyModal";
import { ReactionIcon } from "./Reaction";
import ReactionPicker from "./ReactionPicker";
import ZapModal from "./ZapModal";
import { useSession } from "../state";
import { useSigner } from "../context";
import { EventProps, ReactionKind } from "../types";
import { Zap, Heart, Reply, Repost, Bookmark } from "../icons";
import { ZapRequest } from "../nostr/nip57";
import useReactions, {
  ReactionEvents,
  ReactionKind,
} from "../hooks/useReactions";

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
    <Flex align="center" gap={2} direction="row" {...rest}>
      {customEmoji ? (
        <Image boxSize={4} src={customEmoji[2]} />
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
}

export function ReactionCounts({
  event,
  kinds,
  components,
  events,
  ...rest
}: ReactionCountsProps) {
  const zapModal = useDisclosure();
  const repostModal = useDisclosure();
  const reactionModal = useDisclosure();
  const replyModal = useDisclosure();
  const session = useSession();
  const pubkey = session?.pubkey;
  const canSign = useSigner();
  const { zaps, reactions, replies, reposts, bookmarks } = events;
  const { zapRequests, total } = zaps;
  const hasBookmarks = kinds.includes(NDKKind.BookmarkList);
  const hasReposts = kinds.includes(NDKKind.Repost);

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
                {reactionModal.isOpen && (
                  <ReactionPicker
                    event={event}
                    components={components}
                    {...reactionModal}
                  />
                )}
              </Box>
            );
          } else if (k === NDKKind.Repost || k === NDKKind.GenericRepost) {
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
          } else if (
            k === NDKKind.BookmarkList ||
            k === NDKKind.CategorizedBookmarkList
          ) {
            const bookmark = bookmarks.find((r) => r.pubkey === pubkey);
            return (
              <Box key={k}>
                <ReactionCount
                  icon={Bookmark}
                  count={bookmarks.length}
                  reaction={bookmark}
                  //onClick={canSign ? repostModal.onOpen : undefined}
                  //cursor={canSign ? "pointer" : "auto"}
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
}

export default function Reactions({
  event,
  kinds = defaultReactions,
  ...props
}: ReactionsProps) {
  const { ref, inView } = useInView({
    threshold: 0,
    initialInView: false,
    rootMargin: "50px 0px",
  });
  const events = useReactions(event, kinds, inView);

  return (
    <HStack w="100%" align="center" justifyContent="space-between" ref={ref}>
      <ReactionCounts event={event} kinds={kinds} events={events} {...props} />
      <EventMenu event={event} kinds={kinds} events={events} />
    </HStack>
  );
}
