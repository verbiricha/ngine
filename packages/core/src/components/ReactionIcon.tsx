import { Text, Icon, TextProps, ImageProps } from "@chakra-ui/react";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";

import Emoji from "./Emoji";
import { Heart, Repost } from "../icons";

interface ReactionIconProps
  extends Pick<ImageProps, "size">,
    Pick<TextProps, "fontSize"> {
  event: NDKEvent;
}

export default function ReactionIcon({
  event,
  size = 4,
  fontSize = "md",
}: ReactionIconProps) {
  if (event.kind === NDKKind.Repost || event.kind === NDKKind.GenericRepost) {
    return <Icon as={Repost} boxSize={size} />;
  }

  const emoji = event.content;
  const customEmoji = event.tags.find(
    (t) =>
      emoji &&
      t[0] === "emoji" &&
      t[1] === `${emoji.slice(1, emoji?.length - 1)}`,
  );
  return customEmoji ? (
    <Emoji alt={customEmoji[1]} boxSize={size} src={customEmoji[2]} />
  ) : emoji && !["+", "-"].includes(emoji) ? (
    <Text fontSize={fontSize}>{emoji}</Text>
  ) : (
    <Icon as={Heart} boxSize={size} />
  );
}
