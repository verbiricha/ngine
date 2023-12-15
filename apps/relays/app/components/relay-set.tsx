import { useMemo } from "react";
import {
  Stack,
  HStack,
  Heading,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { User, EventProps } from "@ngine/core";

import Link from "./link";
import RelaySettings from "./relay-settings";
import { tagToRelay } from "../utils";

export default function RelaySet({ event }: EventProps) {
  const title = useMemo(() => event.tagValue("title"), [event]);
  const relays = useMemo(() => {
    return event.tags.filter((t) => t[0] === "relay").map(tagToRelay);
  }, [event]);
  return relays.length > 0 ? (
    <Card variant="event">
      <CardHeader>
        <HStack align="flex-start" justify="space-between">
          <Stack>
            <Heading fontSize="xl">
              {title || (
                <FormattedMessage
                  id="relay-set"
                  description="Relay Set title"
                  defaultMessage="Relay Set"
                />
              )}
            </Heading>
            <User pubkey={event.pubkey} size="xs" fontSize="sm" />
          </Stack>
          <Link variant="brand" href={`/a/${event.encode()}`}>
            <FormattedMessage
              id="explore"
              description="Explore relay set link"
              defaultMessage="Explore"
            />
          </Link>
        </HStack>
      </CardHeader>
      <CardBody>
        <Stack>
          {relays.map((r) => (
            <RelaySettings key={r.url} {...r} showToggle={false} />
          ))}
        </Stack>
      </CardBody>
    </Card>
  ) : null;
}
