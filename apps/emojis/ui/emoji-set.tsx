import {
  Flex,
  HStack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
} from "@chakra-ui/react";
import { EventProps, User, Reactions, Emoji } from "@ngine/core";
import { NDKKind } from "@nostr-dev-kit/ndk";

// todo: if author: edit
// todo: add to favorites emojis

export default function EmojiSet({ event }: EventProps) {
  const title = event.tagValue("d");
  const emojis = event.tags.filter((t) => t[0] === "emoji");
  return (
    <Card variant="event">
      <CardHeader>
        <HStack justifyContent="space-between">
          <Heading fontSize="2xl">{title}</Heading>
          <User size="xs" pubkey={event.pubkey} />
        </HStack>
      </CardHeader>
      <CardBody>
        <Flex gap={4} wrap="wrap">
          {emojis.map((e) => (
            <Emoji key={e[1]} alt={e[1]} src={e[2]} boxSize={8} />
          ))}
        </Flex>
      </CardBody>
      <CardFooter>
        <Reactions
          kinds={[
            NDKKind.Zap,
            NDKKind.Reaction,
            NDKKind.Repost,
            NDKKind.EmojiList,
          ]}
          event={event}
          bookmarkList={NDKKind.EmojiList}
          components={{
            [NDKKind.EmojiSet]: EmojiSet,
          }}
        />
      </CardFooter>
    </Card>
  );
}
