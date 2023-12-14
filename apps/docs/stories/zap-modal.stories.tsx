import type { Meta, StoryObj } from "@storybook/react";
import { useDisclosure, Button } from "@chakra-ui/react";
import { ZapModal } from "@ngine/core";

const meta: Meta<typeof ZapModal> = {
  title: "Components / Zap Modal",
  component: ZapModal,
};

export default meta;

type Story = StoryObj<typeof ZapModal>;

export const Primary: Story = {
  name: "Pubkey",
  render(props) {
    const modalProps = useDisclosure();
    return (
      <>
        <Button onClick={modalProps.onOpen}>Open</Button>
        <ZapModal
          pubkey="7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194"
          {...modalProps}
          {...props}
        />
      </>
    );
  },
  args: {},
};
