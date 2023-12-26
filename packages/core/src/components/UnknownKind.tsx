import { HStack, Card, CardHeader, CardBody, Text } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";

import User from "./User";
import Blockquote from "./Blockquote";
import Markdown from "./Markdown";
import { EventProps } from "../types";

import RecommendedAppMenu from "./RecommendedAppMenu";

export default function UnknownKind({ event }: EventProps) {
  const alt = event.tagValue("alt");

  return (
    <Card variant="event">
      <CardHeader>
        <HStack align="center" justify="space-between">
          <User pubkey={event.pubkey} />
          <RecommendedAppMenu event={event} size="xs" />
        </HStack>
      </CardHeader>
      <CardBody>
        {alt ? (
          <Blockquote>
            <Markdown content={alt} tags={event.tags} />
          </Blockquote>
        ) : (
          <Text>
            <FormattedMessage
              id="ngine.unknown-kind"
              description="Message to show for unknwon kinds"
              defaultMessage="Unknown event with kind { kind }"
              values={{ kind: event.kind }}
            />
          </Text>
        )}
      </CardBody>
    </Card>
  );
}
