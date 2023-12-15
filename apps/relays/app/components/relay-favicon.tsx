import { Avatar, AvatarProps, Tooltip, Icon } from "@chakra-ui/react";
import RelayIcon from "./relay-icon";

interface RelayFaviconProps extends AvatarProps {
  url: string;
}

export default function RelayFavicon({ url, ...rest }: RelayFaviconProps) {
  const domain = url
    .replace("wss://", "https://")
    .replace("ws://", "http://")
    .replace("relay.damus", "damus")
    .replace(/\/$/, "");
  return (
    <Tooltip label={url}>
      <Avatar
        size="sm"
        src={`${domain}/favicon.ico`}
        icon={<Icon as={RelayIcon} />}
        {...rest}
      />
    </Tooltip>
  );
}
