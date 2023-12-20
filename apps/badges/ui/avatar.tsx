import { Box } from "@chakra-ui/react";
import { Avatar as NostrAvatar } from "@ngine/core";

import { gradient } from "./const";

interface AvatarProps {
  p: number;
  pubkey: string;
}

export default function Avatar({ p = 1, pubkey, ...props }: AvatarProps) {
  return (
    <Box p={p} bg={gradient} borderRadius="120px">
      <NostrAvatar pubkey={pubkey} size="xl" {...props} />
    </Box>
  );
}
