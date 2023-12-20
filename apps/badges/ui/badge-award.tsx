import {
  HStack,
  Stack,
  Image,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import {
  useAddress,
  tagValues,
  EventProps,
  AvatarGroup,
  User,
  Avatar,
} from "@ngine/core";

import Badge from "./badge";

interface BadgeAwardProps extends EventProps {}

export default function BadgeAward({ event }: BadgeAwardProps) {
  const a = event.tagValue("a");
  const badge = useAddress(a);
  const pubkeys = tagValues(event, "p");
  return (
    <Stack>
      <HStack justify="space-between">
        <Avatar pubkey={event.pubkey} />
        <AvatarGroup pubkeys={pubkeys} />
      </HStack>
      {badge && <Badge event={badge} />}
    </Stack>
  );
}
