import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Tooltip, Stack, HStack, Avatar, Image, Icon } from "@chakra-ui/react";
import {
  useProfile,
  tagValues,
  useEvents,
  useAddresses,
  EventProps,
  User,
  Markdown,
} from "@ngine/core";

import { getPow } from "@core/rarity";
import BadgeIcon from "./badge-icon";
import Surface from "./surface";

function Badge({ event }: EventProps) {
  const router = useRouter();
  const name = event.tagValue("name");
  const thumbnail = event.tagValue("thumbnail");
  const image = event.tagValue("image");
  return (
    <Tooltip label={name}>
      <Avatar
        cursor="pointer"
        src={thumbnail || image}
        size="md"
        icon={<Icon as={BadgeIcon} />}
        onClick={() => router.push(`/a/${event.encode()}`)}
      />
    </Tooltip>
  );
}

export default function ProfileBadge({ event }: EventProps) {
  const badges = tagValues(event, "a");
  const addresses = [...new Set(badges)];
  const { events } = useAddresses(addresses);
  const sorted = useMemo(() => {
    return [...events].sort((a, b) => getPow(b.id) - getPow(a.id));
  }, [events]);
  const profile = useProfile(event.pubkey);
  return (
    <Stack gap={3} maxW="sm">
      <User size="lg" fontSize="xl" pubkey={event.pubkey} />
      <Surface>
        <HStack wrap="wrap" gap={2}>
          {sorted.map((e) => (
            <Badge key={e.id} event={e} />
          ))}
        </HStack>
      </Surface>
    </Stack>
  );
}
