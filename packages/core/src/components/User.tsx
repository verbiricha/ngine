import { useMemo } from "react";
import { HStack, Text } from "@chakra-ui/react";
import type { AvatarProps, TextProps } from "@chakra-ui/react";
import { nip19 } from "nostr-tools";

import Avatar from "./Avatar";
import useProfile from "../hooks/useProfile";
import { useLink, useLinkComponent } from "../context";

interface UserProps
  extends AvatarProps,
    Pick<AvatarProps, "size">,
    Pick<TextProps, "color" | "fontSize" | "fontWeight"> {
  pubkey: string;
}

function shortenPubkey(pk: string) {
  return `${pk.slice(0, 8)}`;
}

interface NpubProps extends UserProps {
  npub: string;
}

function Npub({
  pubkey,
  npub,
  color = "chakra-body-text",
  fontSize,
  fontWeight,
  size = "sm",
  ...rest
}: NpubProps) {
  const Link = useLinkComponent();
  const profile = useProfile(pubkey);
  const url = useLink("npub", npub);
  const component = (
    <HStack>
      <Avatar pubkey={pubkey} size={size} />
      <Text color={color} fontSize={fontSize} fontWeight={fontWeight}>
        {profile?.display_name || profile?.name || shortenPubkey(pubkey)}
      </Text>
    </HStack>
  );
  return url ? <Link href={url}>{component}</Link> : component;
}

// todo: tags on profile for custom emoji
export default function User({
  pubkey,
  color = "chakra-body-text",
  size = "sm",
  ...rest
}: UserProps) {
  const npub = useMemo(() => {
    try {
      return nip19.npubEncode(pubkey);
    } catch (error) {
      console.error("Bad pubkey", pubkey);
    }
  }, [pubkey]);
  return npub ? (
    <Npub pubkey={pubkey} npub={npub} color={color} size={size} {...rest} />
  ) : null;
}
