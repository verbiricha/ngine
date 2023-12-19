import { Avatar, AvatarProps, Tooltip, Icon } from "@chakra-ui/react";

import RelayIcon from "./relay-icon";
import { useRelayMetadata } from "../hooks/useRelayMetadata";

interface RelayFaviconProps extends AvatarProps {
  url: string;
}

export default function RelayFavicon({ url, ...rest }: RelayFaviconProps) {
  const { data: metadata } = useRelayMetadata(url);
  const domain = url
    .replace("wss://", "https://")
    .replace("ws://", "http://")
    .replace("relay.damus", "damus")
    .replace(/\/$/, "");
  return (
    <Tooltip label={url}>
      <Avatar
        size="sm"
        src={metadata?.icon || `${domain}/favicon.ico`}
        icon={<Icon as={RelayIcon} />}
        {...rest}
      />
    </Tooltip>
  );
}
