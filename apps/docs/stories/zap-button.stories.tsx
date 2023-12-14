import type { Meta, StoryObj } from "@storybook/react";
import { useDisclosure, Button } from "@chakra-ui/react";
import { Avatar, ZapButton } from "@ngine/core";

const meta: Meta<typeof ZapButton> = {
  title: "Components / Zap Button",
  component: ZapButton,
};

export default meta;

type Story = StoryObj<typeof ZapButton>;

export const Primary: Story = {
  name: "Pubkey",
  args: {
    pubkey: "7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194",
  },
};

export const Large: Story = {
  name: "Large",
  args: {
    pubkey: "7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194",
    size: "lg",
    boxSize: 8,
  },
};

export const WithAvatar: Story = {
  name: "Avatar",
  args: {
    pubkey: "7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194",
    leftIcon: (
      <Avatar pubkey="7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194" />
    ),
    variant: "outline",
    size: "lg",
  },
};
