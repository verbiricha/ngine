import type { ReactNode } from "react";
import {
  useDisclosure,
  Button,
  Modal,
  ModalProps,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  Heading,
  Text,
} from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";

import { useSession } from "../state";
import { LoginMethod } from "../types";
import Login, { LoginProps } from "./Login";
import LoginMenu, { LoginMenuProps } from "./LoginMenu";

function LoginOption({ method, onLogin }: LoginProps) {
  return (
    <>
      {method === "nip07" && (
        <>
          <Heading fontSize="xl">
            <FormattedMessage
              id="ngine.login-nip07"
              description="Title of extension login section"
              defaultMessage="Nostr extension"
            />
          </Heading>
          <Text>
            <FormattedMessage
              id="ngine.login-nip07-descr"
              description="Description of extension login section"
              defaultMessage="You can use a nostr extension to log in to the site."
            />
          </Text>
        </>
      )}
      {method === "nip46" && (
        <>
          <Heading fontSize="xl">
            <FormattedMessage
              id="ngine.login-nip46"
              description="Title of nip46 login section"
              defaultMessage="Nsecbunker"
            />
          </Heading>
          <Text>
            <FormattedMessage
              id="ngine.login-nsecbunker-descr"
              description="Description of nsecbunker login description"
              defaultMessage="You can log in with nsecbunker URL and sign events remotely"
            />
          </Text>
        </>
      )}
      {method === "npub" && (
        <>
          <Heading fontSize="xl">
            <FormattedMessage
              id="ngine.login-npub"
              description="Title of pubkey login section"
              defaultMessage="Public key"
            />
          </Heading>
          <Text>
            <FormattedMessage
              id="ngine.login-npub-descr"
              description="Description of pubkey login section"
              defaultMessage="You can log in with a pubkey or nostr address for browsing the site in read-only mode."
            />
          </Text>
        </>
      )}
      <Login method={method} onLogin={onLogin} />
    </>
  );
}

interface LoginDialogProps
  extends Omit<ModalProps, "children">,
    Pick<LoginProps, "onLogin"> {
  methods: LoginMethod[];
}

function LoginDialog({ methods, ...rest }: LoginDialogProps) {
  return (
    <Modal {...rest}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <FormattedMessage
            id="ngine.login"
            description="Title of login modal"
            defaultMessage="Log in"
          />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack gap={4}>
            {methods.map((m) => (
              <LoginOption key={m} method={m} {...rest} />
            ))}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

interface LoginButtonProps extends Pick<LoginProps, "onLogin"> {
  methods?: LoginMethod[];
  size?: string;
  menuProps?: Omit<LoginMenuProps, "children">;
  buttonProps?: any;
  children: ReactNode;
}

export default function LoginButton({
  methods = ["nip07", "nip46", "npub"],
  children,
  onLogin,
  size,
  menuProps,
  buttonProps,
}: LoginButtonProps) {
  const session = useSession();
  const modal = useDisclosure();

  return session ? (
    <LoginMenu {...menuProps}>{children}</LoginMenu>
  ) : (
    <>
      <LoginDialog methods={methods} {...modal} onLogin={onLogin} />
      <Button
        variant="solid"
        colorScheme="brand"
        onClick={modal.onOpen}
        size={size}
        {...buttonProps}
      >
        <FormattedMessage
          id="ngine.get-started"
          description="Button for logging in"
          defaultMessage="Get started"
        />
      </Button>
    </>
  );
}
