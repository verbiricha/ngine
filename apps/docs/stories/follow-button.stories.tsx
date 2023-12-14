import type { Meta, StoryObj } from "@storybook/react";
import { FollowButton } from "@ngine/core";

const meta: Meta<typeof FollowButton> = {
  title: "Components / Follow",
  component: FollowButton,
};

export default meta;

type Story = StoryObj<typeof FollowButton>;

export const Primary: Story = {
  name: "Follow",
  args: {
    pubkey: "7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194",
  },
};
