import { HStack } from "@chakra-ui/react";
import { EventProps, ReactionIcon, Avatar } from "@ngine/core";

export default function Reaction({ event }: EventProps) {
  const p = event.tagValue("p");
  return (
    <HStack gap={6}>
      <Avatar pubkey={event.pubkey} />
      <ReactionIcon event={event} fontSize="2xl" boxSize={6} />
      {p && <Avatar pubkey={p} />}
    </HStack>
  );
}
