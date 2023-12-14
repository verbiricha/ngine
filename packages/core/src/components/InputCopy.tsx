import { Button, InputGroup, Input, InputRightElement } from "@chakra-ui/react";
import type { InputGroupProps } from "@chakra-ui/react";
import { useIntl, FormattedMessage } from "react-intl";

import useCopy from "../hooks/useCopy";
import useFeedback from "../hooks/useFeedback";

interface InputCopyProps extends InputGroupProps {
  text: string;
  copyText?: string;
}

export default function InputCopy({ text, copyText, ...rest }: InputCopyProps) {
  const toast = useFeedback();
  const copy = useCopy();
  const { formatMessage } = useIntl();

  async function handleClick() {
    try {
      await copy(copyText ?? text);
      const msg = formatMessage({
        id: "ngine.copy-success",
        description: "Copy to clipboard success message",
        defaultMessage: "Copied to clipboard",
      });
      toast.sucess(msg);
    } catch (error) {
      const msg = formatMessage({
        id: "ngine.copy-error",
        description: "Copy to clipboard error message",
        defaultMessage: "Couldn't copy to clipboard",
      });
      toast.error(msg);
      console.error(error);
    }
  }

  return (
    <InputGroup size="md" {...rest}>
      <Input readOnly pr="4.5rem" type="text" value={text} />
      <InputRightElement width="4.5rem">
        <Button variant="solid" h="1.75rem" size="sm" onClick={handleClick}>
          <FormattedMessage
            id="ngine.copy"
            description="Button for copying"
            defaultMessage="Copy"
          />
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}
