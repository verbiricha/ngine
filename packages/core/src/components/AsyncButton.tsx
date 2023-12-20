import { useState } from "react";
import { Button, ButtonProps } from "@chakra-ui/react";

interface AsyncButtonProps extends ButtonProps {
  onClick: () => Promise<void>;
}

export default function AsyncButton({ onClick, ...props }: AsyncButtonProps) {
  const [isBusy, setIsBusy] = useState(false);
  async function asyncAction() {
    try {
      setIsBusy(true);
      await onClick();
    } catch (error) {
      console.error(error);
    } finally {
      setIsBusy(false);
    }
  }
  return <Button isLoading={isBusy} onClick={asyncAction} {...props} />;
}
