import { useRouter } from "next/navigation";
import { FormattedMessage } from "react-intl";
import {
  Flex,
  HStack,
  Text,
  Heading,
  MenuItem,
  MenuDivider,
  Icon,
} from "@chakra-ui/react";
import { useSession, User, LoginButton } from "@ngine/core";
import { nip19 } from "nostr-tools";

import Link from "./link";
import RelayIcon from "./relay-icon";
import ColorModeToggle from "./color-mode-toggle";
import { maxWidth } from "@ui/const";

export default function Header() {
  const router = useRouter();
  const session = useSession();
  return (
    <Flex
      as="header"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      maxWidth={maxWidth}
      py={2}
      px={4}
    >
      <Flex flexDirection="column">
        <Link href="/">
          <Heading>Nostrrr</Heading>
        </Link>
        <Text color="chakra-subtle-text">
          <FormattedMessage
            id="tagline"
            description="Nostrrr tagline"
            defaultMessage="A nostr relay explorer"
          />
        </Text>
      </Flex>
      <HStack>
        <ColorModeToggle />
        <LoginButton size="sm">
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
            </>
          )}
          <MenuItem
            icon={<Icon as={RelayIcon} />}
            onClick={() => router.push("/relays")}
          >
            <FormattedMessage
              id="relays"
              description="Relays menu item"
              defaultMessage="Relays"
            />
          </MenuItem>
          <MenuDivider />
        </LoginButton>
      </HStack>
    </Flex>
  );
}
