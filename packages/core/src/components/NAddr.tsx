import { Flex, Box, Skeleton } from "@chakra-ui/react";

import Event from "./Event";
import { Components } from "../types";
import useEvent from "../hooks/useEvent";

interface NAddrProps {
  identifier: string;
  kind: number;
  pubkey: string;
  components?: Components;
  relays: string[];
}

export default function NAddr({
  identifier,
  kind,
  pubkey,
  relays,
  components,
}: NAddrProps) {
  const event = useEvent(
    {
      kinds: [kind],
      authors: [pubkey],
      "#d": [identifier],
    },
    {},
    relays,
  );
  return event ? (
    <Flex my={3} justify="center">
      <Event event={event} components={components} />
    </Flex>
  ) : (
    <Box my={3}>
      <Skeleton height="21px" />
    </Box>
  );
}
