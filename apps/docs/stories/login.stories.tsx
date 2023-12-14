import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "@chakra-ui/react";
import { Login, LoginMenu } from "@ngine/core";

const meta: Meta<typeof Login> = {
  title: "Components / Login",
  component: Login,
};

export default meta;

type Story = StoryObj<typeof Login>;

export const Extension: Story = {
  name: "Extension",
  render(props) {
    return (
      <Stack spacing={5}>
        <Login {...props} />
        <LoginMenu />
      </Stack>
    );
  },
  args: {
    method: "nip07",
  },
};

export const Pubkey: Story = {
  name: "Pubkey",
  render(props) {
    return (
      <Stack spacing={5}>
        <Login {...props} />
        <LoginMenu />
      </Stack>
    );
  },
  args: {
    method: "npub",
  },
};
