import type { Meta, StoryObj } from "@storybook/react";
import { AvatarGroup } from "@ngine/core";

const meta: Meta<typeof AvatarGroup> = {
  title: "Components / Avatar Group",
  component: AvatarGroup,
};

export default meta;

type Story = StoryObj<typeof AvatarGroup>;

export const Primary: Story = {
  name: "AvatarGroup",
  args: {
    pubkeys: [
      "1bc70a0148b3f316da33fe3c89f23e3e71ac4ff998027ec712b905cd24f6a411",
      "63fe6318dc58583cfe16810f86dd09e18bfd76aabc24a0081ce2856f330504ed",
      "7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194",
    ],
  },
};
