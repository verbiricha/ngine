import { Stack, Heading, Card, CardHeader, CardBody } from "@chakra-ui/react";
import { User, EventProps } from "@ngine/core";

import RelaySettings from "./relay-settings";
import { tagToRelay } from "../utils";

export default function RelayList({ event }: EventProps) {
  return (
    <Card variant="event">
      <CardHeader>
        <Stack>
          <Heading fontSize="xl">Relays</Heading>
          <User pubkey={event.pubkey} size="xs" fontSize="sm" />
        </Stack>
      </CardHeader>
      <CardBody>
        <Stack>
          {event.tags
            .filter((t) => t[0] === "r")
            .map(tagToRelay)
            .map((r) => (
              <RelaySettings key={r.url} {...r} showToggle={false} />
            ))}
        </Stack>
      </CardBody>
    </Card>
  );
}
