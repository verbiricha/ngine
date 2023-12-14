import { Text } from "@chakra-ui/react";
import type { TextProps } from "@chakra-ui/react";

import useProfile from "../hooks/useProfile";

function shortenPubkey(pk: string) {
  return `${pk.slice(0, 8)}`;
}

interface UsernameProps extends TextProps {
  pubkey: string;
}

export default function Username({ pubkey, ...rest }: UsernameProps) {
  const profile = useProfile(pubkey);
  return (
    <Text {...rest}>
      {profile?.display_name || profile?.name || shortenPubkey(pubkey)}
    </Text>
  );
}
