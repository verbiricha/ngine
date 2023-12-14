import type { Meta, StoryObj } from "@storybook/react";
import { User } from "@ngine/core";

const meta: Meta<typeof User> = {
  title: "Components / User",
  component: User,
};

export default meta;

type Story = StoryObj<typeof User>;

export const Primary: Story = {
  name: "User",
  args: {
    pubkey: "7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194",
  },
};
