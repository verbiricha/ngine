import { useDisclosure, Icon, Button } from "@chakra-ui/react";
import type { ButtonProps, IconProps } from "@chakra-ui/react";
import type { NDKEvent } from "@nostr-dev-kit/ndk";
import { FormattedMessage } from "react-intl";

import ZapModal from "./ZapModal";
import { ZapCircle } from "../icons";

interface ZapButtonProps extends ButtonProps, Pick<IconProps, "boxSize"> {
  pubkey: string;
  event?: NDKEvent;
}

export default function ZapButton({
  pubkey,
  event,
  boxSize = 4,
  ...rest
}: ZapButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        variant="solid"
        colorScheme="brand"
        leftIcon={<Icon boxSize={boxSize} as={ZapCircle} />}
        size="sm"
        onClick={onOpen}
        {...rest}
      >
        <FormattedMessage
          id="ngine.zap-action"
          description="Zap call to action"
          defaultMessage="Zap"
        />
      </Button>
      <ZapModal
        pubkey={pubkey}
        event={event}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
