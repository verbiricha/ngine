import {
  AvatarGroup as BaseAvatarGroup,
  AvatarGroupProps as BaseAvatarGroupProps,
} from "@chakra-ui/react";

import Avatar from "./Avatar";

interface AvatarGroupProps extends Omit<BaseAvatarGroupProps, "children"> {
  pubkeys: string[];
}

// todo: tweak spacing and bg for + part
export default function AvatarGroup({ pubkeys, ...rest }: AvatarGroupProps) {
  return (
    <BaseAvatarGroup size="sm" max={3} spacing="-0.4rem" {...rest}>
      {pubkeys.map((pk) => (
        <Avatar key={pk} pubkey={pk} />
      ))}
    </BaseAvatarGroup>
  );
}
