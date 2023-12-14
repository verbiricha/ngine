import { useMemo } from "react";
import { nip19 } from "nostr-tools";
import { Tooltip, Avatar, AvatarProps } from "@chakra-ui/react";

import useProfile from "../hooks/useProfile";
import { useLink, useLinkComponent } from "../context";

interface NostrAvatarProps extends AvatarProps {
  pubkey: string;
}

export default function NostrAvatar({ pubkey, ...rest }: NostrAvatarProps) {
  const Link = useLinkComponent();
  const npub = useMemo(() => {
    return nip19.npubEncode(pubkey);
  }, [pubkey]);
  const url = useLink("npub", npub);
  const profile = useProfile(pubkey);
  const component = (
    <Tooltip label={profile?.name || pubkey}>
      <Avatar
        name={profile?.name || pubkey}
        src={profile?.image}
        size="sm"
        {...rest}
      />
    </Tooltip>
  );
  return url ? <Link href={url}>{component}</Link> : component;
}
