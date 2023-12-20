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
import { nip19 } from "nostr-tools";

import Link from "./link";

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
              <Emoji
                alt="peepoDJ"
                src="https://cdn.betterttv.net/emote/6183da881f8ff7628e6c6653/3x.webp"
                boxSize={8}
              />
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
        {session?.pubkey && (
          <Button
            variant="outline"
            colorScheme="brand"
            onClick={() => router.push("/new")}
            size="sm"
          >
            New emoji set
          </Button>
        )}
        <LoginButton size="sm" methods={["nip07", "npub"]}>
          {session?.pubkey && (
            <MenuItem
              onClick={() =>
                router.push(`/p/${nip19.npubEncode(session.pubkey)}`)
              }
            >
              <User pubkey={session.pubkey} />
            </MenuItem>
          )}
          <MenuDivider />
        </LoginButton>
      </HStack>
    </Flex>
  );
}
