import { Text, Icon, TextProps, ImageProps, HStack } from "@chakra-ui/react";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";

import Emoji from "./Emoji";
import { Heart, Repost, Bookmark } from "../icons";
import { REPOSTS, BOOKMARKS } from "../nostr/kinds";
import { extractCustomEmoji } from "../nostr/emoji";

interface ReactionIconProps extends Pick<TextProps, "fontSize"> {
  boxSize?: number;
  event: NDKEvent;
}

export default function ReactionIcon({
  event,
  boxSize = 4,
  fontSize = "md",
}: ReactionIconProps) {
  if (REPOSTS.includes(event.kind as number)) {
    return <Icon as={Repost} boxSize={boxSize} />;
  }

  if (BOOKMARKS.includes(event.kind as number)) {
    return <Icon as={Bookmark} boxSize={boxSize} />;
  }

  const hasCustomEmoji = event.tags.find((t) => t[0] === "emoji");
  return hasCustomEmoji ? (
    <HStack display="inline">
      {extractCustomEmoji([event.content], event.tags, boxSize)}
    </HStack>
  ) : !["+", "-"].includes(event.content) ? (
    <Text fontSize={fontSize}>{event.content}</Text>
  ) : (
    // todo: dislike
    <Icon as={Heart} boxSize={boxSize} />
  );
}
