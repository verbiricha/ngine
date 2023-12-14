import type { Meta, StoryObj } from "@storybook/react";
import { Username } from "@ngine/core";

const meta: Meta<typeof Username> = {
  title: "Components / Username",
  component: Username,
};

export default meta;

type Story = StoryObj<typeof Username>;

export const Primary: Story = {
  name: "Username",
  args: {
    pubkey: "7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194",
  },
};
