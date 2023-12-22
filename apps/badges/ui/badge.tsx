import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useColorModeValue,
  Flex,
  Stack,
  StackProps,
  HStack,
  HStackProps,
  Image,
  Heading,
  Text,
  Icon,
} from "@chakra-ui/react";
import {
  useSession,
  useSigner,
  useAddress,
  useEvents,
  tagValues,
  EventProps,
  User,
  Markdown,
} from "@ngine/core";
import { nip13 } from "nostr-tools";

import AwardBadge from "./award-badge";
import { Rarities, getRarity } from "@core/rarity";
import useAwards from "@hooks/useAwards";
import BadgeIcon from "./badge-icon";
import ZapCircle from "./zap-circle";
import Surface from "./surface";

const rarityColor = {
  [Rarities.Normal]: "chakra-fg-text",
  [Rarities.Rare]: "#62A1FF",
  [Rarities.SuperRare]: "#70FFE5",
  [Rarities.Epic]: "#AF71FF",
  [Rarities.Legendary]: "#FF9736",
};

const rarityName = {
  [Rarities.Normal]: "Normal",
  [Rarities.Rare]: "Rare",
  [Rarities.SuperRare]: "Super Rare",
  [Rarities.Epic]: "Epic",
  [Rarities.Legendary]: "Legendary",
};

function Rarity({ rarity }: { rarity: Rarities }) {
  const bg = useColorModeValue("white", "gray.800");
  const fg = useColorModeValue("body", "white");

  return (
    <HStack
      gap={2}
      padding="2px 8px 2px 2px"
      color={rarityColor[rarity]}
      bg={bg}
      borderRadius="24px"
      position="absolute"
      top="16px"
      right="16px"
    >
      <ZapCircle />
      <Text fontWeight={600} color={rarityColor[rarity]} fontSize="sm">
        {rarityName[rarity]}
      </Text>
    </HStack>
  );
}

function BadgeDetails({
  event,
  rarity,
}: {
  event: NDKEvent;
  rarity: Rarities | null;
}) {
  const session = useSession();
  const canSign = useSigner();
  const { awards, awardees } = useAwards(event);
  const isOwner = event.pubkey === session?.pubkey;
  return (
    <Stack mt={4} w="100%" fontSize="sm">
      <HStack justify="space-between">
        <Text color="chakra-subtle-text">Creator</Text>
        <User color="#B084FF" pubkey={event.pubkey} />
      </HStack>
      {rarity && (
        <HStack justify="space-between">
          <Text color="chakra-subtle-text">PoW Rarity</Text>
          <Text fontWeight={600} color={rarityColor[rarity]} fontSize="sm">
            {rarityName[rarity]}
          </Text>
        </HStack>
      )}
      <HStack justify="space-between">
        <Text color="chakra-subtle-text">Times Awarded</Text>
        <Text fontWeight={600} fontSize="sm">
          {awards.length}
        </Text>
      </HStack>
      {isOwner && canSign && <AwardBadge event={event} />}
    </Stack>
  );
}

function Awardees({ event }: { event: NDKEvent }) {
  const { awardees } = useAwards(event);
  return awardees.length > 0 ? (
    <Surface w="100%">
      <Heading fontSize="3xl">Awardees</Heading>
      <Stack align="left" gap={3} w="100%">
        {awardees.map((pk) => (
          <User size="md" fontSize="lg" key={pk} pubkey={pk} />
        ))}
      </Stack>
    </Surface>
  ) : null;
}

interface BadgeProps extends EventProps, StackProps {
  showDetails?: boolean;
  linkToBadge?: boolean;
}

export default function Badge({
  event,
  showDetails,
  linkToBadge = true,
  ...props
}: BadgeProps) {
  const size = "248.871px";
  const name = event.tagValue("name");
  const image = event.tagValue("image");
  const thumbnail = event.tagValue("thumb");
  const description = event.tagValue("description");
  const rarity = event.id ? getRarity(event.id) : null;
  const router = useRouter();

  function goToBadge() {
    if (event.id && linkToBadge) {
      router.push(`/a/${event.encode()}`);
    }
  }

  return (
    <Stack align="center" w="100%" maxW="sm" gap={5} {...props}>
      <Surface
        w="100%"
        position="relative"
        cursor={event.id && linkToBadge ? "pointer" : "auto"}
        onClick={goToBadge}
        minH="sm"
        h="100%"
      >
        {rarity && <Rarity rarity={rarity} />}
        <Image
          fallback={
            <Flex align="center" justify="center" height={size} width={size}>
              <Icon as={BadgeIcon} boxSize={60} />
            </Flex>
          }
          src={image || thumbnail}
          width={size}
          height={size}
          fit="cover"
        />
        <Heading fontSize="lg" fontWeight={700} textAlign="center">
          {name}
        </Heading>
        <Text color="chakra-subtle-text" fontSize="sm" textAlign="center">
          <Markdown
            content={showDetails ? description : description?.split("\n")[0]}
            tags={event.tags}
          />
        </Text>
        {showDetails && <BadgeDetails event={event} rarity={rarity} />}
      </Surface>
      {showDetails && <Awardees event={event} />}
    </Stack>
  );
}
