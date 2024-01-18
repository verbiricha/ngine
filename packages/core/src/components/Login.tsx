import { useState } from "react";
import {
  useToast,
  Avatar as ChakraAvatar,
  Heading,
  Text,
  Button,
  Divider,
  Stack,
  HStack,
  Input,
} from "@chakra-ui/react";
import { useIntl, FormattedMessage } from "react-intl";

import Avatar from "./Avatar";
import PubkeyPicker from "./PubkeyPicker";
import useFeedback from "../hooks/useFeedback";
import {
  useExtensionLogin,
  usePubkeyLogin,
  useBunkerLogin,
  useLinkComponent,
} from "../context";
import type { LoginMethod } from "../types";

export interface LoginProps {
  onLogin?: () => void;
  method: LoginMethod;
}

export function LoginNip07({ onLogin }: LoginProps) {
  const toast = useFeedback();
  const { formatMessage } = useIntl();
  const [isBusy, setIsBusy] = useState(false);
  const extensionLogIn = useExtensionLogin();

  async function loginWithExtension() {
    try {
      setIsBusy(true);
      const user = await extensionLogIn();
      if (user) {
        onLogin && onLogin();
      }
    } catch (error) {
      const msg = formatMessage({
        id: "ngine.login-error",
        description: "Login failed error message",
        defaultMessage: "Could not sign in",
      });
      toast.error((error as Error)?.message, msg);
      console.error(error);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <Button
      isLoading={isBusy}
      isDisabled={!window.nostr}
      variant="solid"
      colorScheme="brand"
      onClick={loginWithExtension}
    >
      <FormattedMessage
        id="ngine.extension-login"
        description="A button for loggin in with a nostr extension"
        defaultMessage="Log in with extension"
      />
    </Button>
  );
}

export function LoginPubkey({ onLogin }: LoginProps) {
  const toast = useFeedback();
  const [pubkey, setPubkey] = useState<string | undefined>();
  const { formatMessage } = useIntl();
  const [isBusy, setIsBusy] = useState(false);
  const pubkeyLogin = usePubkeyLogin();

  async function loginWithPubkey() {
    try {
      setIsBusy(true);
      const user = await pubkeyLogin(pubkey!);
      if (user) {
        onLogin && onLogin();
      }
    } catch (error) {
      console.error(error);
      const msg = formatMessage({
        id: "ngine.login-error",
        description: "Login failed error message",
        defaultMessage: "Could not sign in",
      });
      toast.error((error as Error)?.message, msg);
      console.error(error);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <Stack>
      <HStack minW="20em">
        <PubkeyPicker onPubkey={setPubkey} />
        {pubkey ? <Avatar pubkey={pubkey} /> : <ChakraAvatar size="sm" />}
      </HStack>
      <Button
        isLoading={isBusy}
        isDisabled={!pubkey}
        variant="solid"
        colorScheme="brand"
        onClick={loginWithPubkey}
      >
        <FormattedMessage
          id="ngine.pubkey-login"
          description="A button for logging in with a public key"
          defaultMessage="Log in (read only)"
        />
      </Button>
    </Stack>
  );
}

export function LoginBunker({ onLogin }: LoginProps) {
  const toast = useFeedback();
  const { formatMessage } = useIntl();
  const [url, setUrl] = useState<string | undefined>();
  const [isBusy, setIsBusy] = useState(false);
  const bunkerLogin = useBunkerLogin();

  async function loginWithBunker() {
    try {
      setIsBusy(true);
      if (url) {
        const user = await bunkerLogin(url);
        if (user) {
          onLogin && onLogin();
        }
      }
    } catch (error) {
      console.error(error);
      const msg = formatMessage({
        id: "ngine.login-error",
        description: "Login failed error message",
        defaultMessage: "Could not sign in",
      });
      toast.error((error as Error)?.message, msg);
      console.error(error);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <Stack>
      <HStack minW="20em">
        <Input
          isDisabled={isBusy}
          placeholder={formatMessage({
            id: "ngine.bunker-url-placeholder",
            description: "Bunker URL placeholder",
            defaultMessage: "bunker:// URL or nostr address",
          })}
          value={url}
          onChange={(ev) => setUrl(ev.target.value)}
        />
      </HStack>
      <Button
        isLoading={isBusy}
        isDisabled={!url}
        variant="solid"
        colorScheme="brand"
        onClick={loginWithBunker}
      >
        <FormattedMessage
          id="ngine.bunker-login"
          description="A button for logging in with a nsecbunker"
          defaultMessage="Log in"
        />
      </Button>
    </Stack>
  );
}

export default function Login({ method, onLogin }: LoginProps) {
  if (method === "nip07") {
    return <LoginNip07 method={method} onLogin={onLogin} />;
  }

  if (method === "npub") {
    return <LoginPubkey method={method} onLogin={onLogin} />;
  }

  if (method === "nip46") {
    return <LoginBunker method={method} onLogin={onLogin} />;
  }

  return null;
}
