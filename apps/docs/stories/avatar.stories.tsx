import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "@ngine/core";

const meta: Meta<typeof Avatar> = {
  title: "Components / Avatar",
  component: Avatar,
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Primary: Story = {
  name: "Avatar",
  args: {
    pubkey: "7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194",
  },
};
