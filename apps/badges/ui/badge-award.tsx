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
  useSession,
  useSign,
  useAddress,
  tagValues,
  AvatarGroup,
  User,
  Avatar,
} from "@ngine/core";
import { NDKEvent } from "@nostr-dev-kit/ndk";

import Surface from "./surface";
import Badge from "./badge";
import BadgeSettings from "./badge-settings";

interface BadgeAwardProps {
  award: NDKEvent;
  profile?: NDKEvent;
}

export default function BadgeAward({ award, profile }: BadgeAwardProps) {
  const session = useSession();
  const a = award.tagValue("a");
  const badge = useAddress(a);
  const pubkeys = tagValues(award, "p");
  const isForMe = pubkeys.includes(session?.pubkey);

  return (
    <Surface>
      <HStack justify="space-between" w="100%">
        <Avatar pubkey={award.pubkey} />
        <AvatarGroup pubkeys={pubkeys} />
      </HStack>
      {badge && <Badge event={badge} />}
      {badge && profile && session?.pubkey && (
        <BadgeSettings
          badge={badge}
          award={award}
          profile={profile}
          pubkey={session.pubkey}
        />
      )}
    </Surface>
  );
}
