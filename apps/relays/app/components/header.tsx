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

import Link from "./link";
import RelayIcon from "./relay-icon";
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
      maxWidth="48rem"
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
        <LoginButton size="sm" methods={["nip07", "npub"]}>
          {session?.pubkey && (
            <>
              <MenuItem>
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
