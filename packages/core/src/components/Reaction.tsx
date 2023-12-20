import {
  Stack,
  HStack,
  Text,
  TextProps,
  Icon,
  ImageProps,
} from "@chakra-ui/react";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";

import Address from "./Address";
import NEvent from "./NEvent";
import User from "./User";
import Emoji from "./Emoji";
import { EventProps } from "../types";
import { Heart, Repost } from "../icons";

interface ReactionIconProps
  extends Pick<ImageProps, "boxSize">,
    Pick<TextProps, "fontSize"> {
  event: NDKEvent;
}

export function ReactionIcon({ event, boxSize, fontSize }: ReactionIconProps) {
  if (event.kind === NDKKind.Repost || event.kind === NDKKind.GenericRepost) {
    return <Icon as={Repost} boxSize={boxSize} />;
  }
  // fixme: can be multiple emoji
  const emoji = event.content;
  const customEmoji = event.tags.find(
    (t) =>
      emoji &&
      t[0] === "emoji" &&
      t[1] === `${emoji.slice(1, emoji?.length - 1)}`,
  );
  return customEmoji ? (
    <Emoji alt={customEmoji[1]} boxSize={boxSize} src={customEmoji[2]} />
  ) : emoji && !["+", "-"].includes(emoji) ? (
    <Text fontSize={fontSize}>{emoji}</Text>
  ) : (
    <Icon as={Heart} boxSize={boxSize} />
  );
}

export default function Reaction({ event, ...props }: EventProps) {
  const e = event.tagValue("e");
  const a = event.tagValue("a");
  return (
    <Stack gap={1} w="100%">
      <HStack>
        <ReactionIcon event={event} boxSize={6} fontSize="lg" />
        <User size="xs" fontSize="sm" pubkey={event.pubkey} />
      </HStack>
      {e && <NEvent id={e} {...props} />}
      {a && <Address address={a} {...props} />}
    </Stack>
  );
}
