import type { Meta, StoryObj } from "@storybook/react";
import { Amount } from "@ngine/core";

const meta: Meta<typeof Amount> = {
  title: "Components / Amount",
  component: Amount,
};

export default meta;

type Story = StoryObj<typeof Amount>;

export const Primary: Story = {
  name: "Satoshi",
  args: {
    amount: 2100,
    currency: "BTC",
  },
};

export const USD: Story = {
  name: "USD",
  args: {
    amount: 2100,
    currency: "USD",
  },
};

export const EUR: Story = {
  name: "EUR",
  args: {
    amount: 2100,
    currency: "EUR",
  },
};
