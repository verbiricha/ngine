"use client";

import { useRouter } from "next/navigation";
import {
  useColorMode,
  Flex,
  HStack,
  Text,
  Heading,
  MenuItem,
  MenuDivider,
  Icon,
  IconButton,
  Button,
  MenuButton,
} from "@chakra-ui/react";
import {
  useSigner,
  useSession,
  User,
  Username,
  LoginButton,
} from "@ngine/core";
import { nip19 } from "nostr-tools";

import ColorModeSwitch from "./color-mode-switch";
import Link from "./link";
import Avatar from "./avatar";

import { useIntl } from "react-intl";

export default function Header() {
  const router = useRouter();
  const session = useSession();
  const canSign = useSigner();
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
          <Heading fontSize="3xl" fontWeight={700}>
            Badges
          </Heading>
        </Link>
      </Flex>
      <Flex
        align="center"
        gap={{
          base: 2,
          sm: 4,
        }}
        h={20}
      >
        {session?.pubkey && (
          <Button
            disabled={!canSign}
            variant="gradient"
            size="sm"
            onClick={() => router.push("/new")}
          >
            New Badge
          </Button>
        )}
        <LoginButton
          methods={["nip07", "npub"]}
          button={
            session?.pubkey ? (
              <MenuButton
                variant="link"
                bg="transparent"
                size="md"
                as={Button}
                rightIcon={null}
              >
                <Avatar p={0.5} pubkey={session.pubkey} size="md" />
              </MenuButton>
            ) : null
          }
          buttonProps={{ variant: "gradient", size: "sm" }}
        >
          {session?.pubkey && (
            <MenuItem
              onClick={() =>
                router.push(`/p/${nip19.npubEncode(session.pubkey)}`)
              }
              icon={<Avatar p={0.5} pubkey={session.pubkey} size="xs" />}
            >
              <Username pubkey={session.pubkey} />
            </MenuItem>
          )}
          <MenuDivider />
          <MenuItem closeOnSelect={false}>
            <ColorModeSwitch />
          </MenuItem>
          <MenuDivider />
        </LoginButton>
      </Flex>
    </Flex>
  );
}