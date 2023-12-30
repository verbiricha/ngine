import { useRouter } from "next/navigation";
import {
  Flex,
  Stack,
  HStack,
  Heading,
  MenuItem,
  MenuDivider,
  Button,
  Image,
} from "@chakra-ui/react";
import { useSession, User, LoginButton } from "@ngine/core";
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
        <Link href="/">
          <Image
            alt="emojito logo"
            src="/logo.png"
            boxSize={20}
            style={{ transform: "scale(1.5)" }}
          />
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
