import type { Meta, StoryObj } from "@storybook/react";
import { Onboarding } from "@ngine/core";

const meta: Meta<typeof Onboarding> = {
  title: "Components / Onboarding",
  component: Onboarding,
};

export default meta;

type Story = StoryObj<typeof Onboarding>;

export const Primary: Story = {
  name: "Onboarding",
  args: {},
};
