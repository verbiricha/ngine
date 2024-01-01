import { useMemo } from "react";
import { HStack, Text, Icon } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { useRelays } from "@ngine/core";

import Link from "./link";
import RelayFavicon from "./relay-favicon";
import { humanize, encode } from "@lib/urls";

interface RelayLinkProps {
  url: string;
}

export default function RelayLink({ url }: RelayLinkProps) {
  const relays = useRelays();
  const isInMyRelays = useMemo(
    () => relays.map(humanize).includes(humanize(url)),
    [relays, url],
  );
  const encoded = useMemo(() => `/relay/${encode(url)}`, [url]);
  const domain = useMemo(() => humanize(url), [url]);
  return (
    <Link key={url} href={encoded}>
      <HStack spacing={2}>
        <RelayFavicon url={url} size="xs" />
        <Text fontSize="md">{domain}</Text>
        {isInMyRelays && <Icon as={StarIcon} color="orange.300" />}
      </HStack>
    </Link>
  );
}
