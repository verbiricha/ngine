import { HStack, Tag, TagLabel } from "@chakra-ui/react";
import { Relay } from "@ngine/core";

import RelayLink from "./relay-link";
import ToggleRelay from "./toggle-relay";

interface RelaySettingsProps extends Relay {
  showToggle?: boolean;
}

export default function RelaySettings({
  url,
  read,
  write,
  showToggle = true,
}: RelaySettingsProps) {
  // todo: edit read/write status
  return (
    <HStack align="center" justify="space-between">
      <RelayLink url={url} />
      <HStack>
        {read && (
          <Tag size="sm">
            <TagLabel>read</TagLabel>
          </Tag>
        )}
        {write && (
          <Tag size="sm">
            <TagLabel>write</TagLabel>
          </Tag>
        )}
        {showToggle && <ToggleRelay url={url} />}
      </HStack>
    </HStack>
  );
}
