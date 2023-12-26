import {
  Box,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  CardProps,
} from "@chakra-ui/react";
import { NDKKind } from "@nostr-dev-kit/ndk";

import NEvent from "./NEvent";
import User from "./User";
import Markdown from "./Markdown";
import Reactions from "./Reactions";
import FormattedRelativeTime from "./FormattedRelativeTime";
import RecommendedAppMenu from "./RecommendedAppMenu";
import { EventProps, ReactionKind } from "../types";
interface NoteProps extends EventProps, CardProps {}

const defaultReactionKinds: ReactionKind[] = [
  NDKKind.Zap,
  NDKKind.Repost,
  NDKKind.Reaction,
  NDKKind.Text,
];

// todo: collapsed + read more
// todo: image gallery
// todo: lazily show content?
export default function Note({
  event,
  components,
  reactionKinds = defaultReactionKinds,
  ...rest
}: NoteProps) {
  const e = event.tags.find((t) => t[0] === "e" && t[3] === "reply");
  const root = event.tags.find((t) => !e && t[0] === "e" && t[3] === "root");
  return (
    <Card variant="event" {...rest}>
      <CardHeader>
        <HStack align="center" justify="space-between">
          <User pubkey={event.pubkey} />
          <HStack>
            {event.sig && (
              <Text color="gray.400" fontSize="sm">
                <FormattedRelativeTime timestamp={event.created_at ?? 0} />
              </Text>
            )}
            <RecommendedAppMenu event={event} size="xs" />
          </HStack>
        </HStack>
      </CardHeader>
      <CardBody>
        {e && (
          <Box mb={2}>
            <NEvent
              id={e[1]}
              relays={[]}
              components={components}
              reactionKinds={[]}
            />
          </Box>
        )}
        {root && (
          <Box mb={2}>
            <NEvent
              id={root[1]}
              relays={[]}
              components={components}
              reactionKinds={[]}
            />
          </Box>
        )}
        <Markdown
          content={event.content}
          components={components}
          tags={event.tags}
        />
      </CardBody>
      {reactionKinds.length > 0 && (
        <CardFooter>
          <Reactions
            kinds={reactionKinds}
            event={event}
            components={components}
          />
        </CardFooter>
      )}
    </Card>
  );
}
