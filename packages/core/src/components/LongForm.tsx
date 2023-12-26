import { useState } from "react";
import {
  Box,
  HStack,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  CardProps,
  Stack,
  Button,
} from "@chakra-ui/react";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { FormattedMessage } from "react-intl";

import NEvent from "./NEvent";
import User from "./User";
import Markdown from "./Markdown";
import Reactions from "./Reactions";
import FormattedRelativeTime from "./FormattedRelativeTime";
import RecommendedAppMenu from "./RecommendedAppMenu";
import { EventProps, ReactionKind } from "../types";

interface LongFormProps extends EventProps, CardProps {}

const defaultReactionKinds: ReactionKind[] = [
  NDKKind.Zap,
  NDKKind.GenericRepost,
  NDKKind.Reaction,
  NDKKind.Text,
];

export default function LongForm({
  event,
  components,
  reactionKinds = defaultReactionKinds,
  ...rest
}: LongFormProps) {
  const [seeAll, setSeeAll] = useState(false);
  const summary = event.tagValue("summary");
  const title = event.tagValue("title");
  //const image = event.tagValue("image")
  const publishedAt = event.tagValue("published_at");
  return (
    <Card variant="event" {...rest}>
      <CardHeader>
        <HStack align="center" justify="space-between">
          <User pubkey={event.pubkey} />
          <HStack>
            {event.sig && publishedAt && (
              <Text color="gray.400" fontSize="sm">
                <FormattedRelativeTime timestamp={Number(publishedAt)} />
              </Text>
            )}
            <RecommendedAppMenu event={event} size="xs" />
          </HStack>
        </HStack>
      </CardHeader>
      <CardBody>
        <Stack>
          <Heading fontSize="xl" dir="auto">
            {title}
          </Heading>
          {seeAll ? (
            <Markdown
              content={event.content}
              components={components}
              tags={event.tags}
            />
          ) : summary ? (
            <Markdown
              content={summary}
              components={components}
              tags={event.tags}
            />
          ) : null}
          <Button
            variant="link"
            onClick={() => setSeeAll(!seeAll)}
            size="sm"
            colorScheme="brand"
          >
            {seeAll ? (
              <FormattedMessage
                id="ngine.read-less"
                description="Collapse full article into only summary"
                defaultMessage="Collapse story"
              />
            ) : (
              <FormattedMessage
                id="ngine.read-more"
                description="Read a full article"
                defaultMessage="Read full story"
              />
            )}
          </Button>
        </Stack>
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
