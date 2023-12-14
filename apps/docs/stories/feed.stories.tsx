import type { Meta, StoryObj } from "@storybook/react";
import { Stack, Heading } from "@chakra-ui/react";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { User, Feed } from "@ngine/core";

const meta: Meta<typeof Feed> = {
  title: "Components / Feed",
  component: Feed,
};

export default meta;

type Story = StoryObj<typeof Feed>;

export const Hashtag: Story = {
  render(props) {
    return (
      <Stack align="center" justify="center">
        <Heading>#habla</Heading>
        <Feed {...props} w="md" />
      </Stack>
    );
  },
  args: {
    filter: {
      kinds: [NDKKind.Text, NDKKind.Article],
      "#t": ["habla"],
    },
    pageSize: 20,
  },
};

export const LongForm: Story = {
  name: "Long form",
  render(props) {
    return (
      <Stack align="center" justify="center">
        <Heading>Long form articles</Heading>
        <Feed {...props} w="lg" />
      </Stack>
    );
  },
  args: {
    filter: {
      kinds: [NDKKind.Article],
    },
    pageSize: 20,
  },
};

export const UserFeed: Story = {
  name: "User",
  render(props) {
    return (
      <Stack align="center" justify="center">
        <User pubkey="7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194" />
        <Feed {...props} w="lg" />
      </Stack>
    );
  },
  args: {
    filter: {
      authors: [
        "7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194",
      ],
    },
    pageSize: 20,
  },
};

export const ReactionsFeed: Story = {
  name: "Reactions",
  render(props) {
    return (
      <Stack align="center" justify="center">
        <Feed {...props} w="lg" />
      </Stack>
    );
  },
  args: {
    filter: {
      kinds: [NDKKind.Reaction],
    },
    pageSize: 20,
  },
};

export const RepostsFeed: Story = {
  name: "Reposts",
  render(props) {
    return (
      <Stack align="center" justify="center">
        <Feed {...props} w="lg" />
      </Stack>
    );
  },
  args: {
    filter: {
      kinds: [NDKKind.Repost, NDKKind.GenericRepost],
    },
    pageSize: 20,
  },
};
