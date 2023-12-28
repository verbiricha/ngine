import { useRouter } from "next/navigation";
import {
  Flex,
  Stack,
  HStack,
  Heading,
  MenuItem,
  MenuDivider,
  Button,
} from "@chakra-ui/react";
import { useSession, User, LoginButton, Emoji } from "@ngine/core";
import { AddIcon } from "@chakra-ui/icons";
import { nip19 } from "nostr-tools";

import Link from "./link";
import ColorModeToggle from "./color-mode-toggle";

export default function Header() {
  const router = useRouter();
  const session = useSession();
  return (
    <Flex
      as="header"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      maxWidth="60rem"
      py={2}
      px={4}
    >
      <Flex flexDirection="column">
        <Link href="/" sx={{ _hover: { textDecoration: "none" } }}>
          <Heading>
            <Stack align="center">
              <HStack gap={4}>
                <Emoji
                  alt="xar2EDM"
                  src="https://cdn.betterttv.net/emote/5b7e01fbe429f82909e0013a/3x.webp"
                  boxSize={8}
                />
                <Emoji
                  alt="peepoDJ"
                  src="https://cdn.betterttv.net/emote/6183da881f8ff7628e6c6653/3x.webp"
                  boxSize={8}
                />
                <Emoji
                  alt="xar2EDM"
                  src="https://cdn.betterttv.net/emote/5b7e01fbe429f82909e0013a/3x.webp"
                  boxSize={8}
                />
              </HStack>
              <HStack gap={0}>
                <Emoji
                  alt="Dance"
                  src="https://cdn.betterttv.net/emote/5aa1d0e311237146531078b0/3x.webp"
                  boxSize={8}
                />
                <Emoji
                  alt="Dance"
                  src="https://cdn.betterttv.net/emote/5aa1d0e311237146531078b0/3x.webp"
                  boxSize={8}
                />
                <Emoji
                  alt="Dance"
                  src="https://cdn.betterttv.net/emote/5aa1d0e311237146531078b0/3x.webp"
                  boxSize={8}
                />
                <Emoji
                  alt="Dance"
                  src="https://cdn.betterttv.net/emote/5aa1d0e311237146531078b0/3x.webp"
                  boxSize={8}
                />
              </HStack>
            </Stack>
          </Heading>
        </Link>
      </Flex>
      <HStack>
        <ColorModeToggle />
        <LoginButton size="sm" methods={["nip07", "npub"]}>
          {session?.pubkey && (
            <>
              <MenuItem
                onClick={() =>
                  router.push(`/p/${nip19.npubEncode(session.pubkey)}`)
                }
              >
                <User pubkey={session.pubkey} />
              </MenuItem>
              <MenuDivider />
              <MenuItem icon={<AddIcon />} onClick={() => router.push("/new")}>
                New emoji set
              </MenuItem>
            </>
          )}
          <MenuDivider />
        </LoginButton>
      </HStack>
    </Flex>
  );
}
