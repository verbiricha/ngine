import type { Meta, StoryObj } from "@storybook/react";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useNDK, Note } from "@ngine/core";

const meta: Meta<typeof Note> = {
  title: "Components / Note",
  component: Note,
};

export default meta;

type Story = StoryObj<typeof Note>;

export const Primary: Story = {
  render(props) {
    const ndk = useNDK();
    const event = new NDKEvent(ndk, {
      content:
        "I'm writing a JS framework based on NDK and React for quickly developing nostr web apps with a bunch of goodies: session management, onboarding, i18n, premade components for feeds, notes, long form, zapping... I'm going to port my gear to use it and build a docs site, it'll take some time but once is ready it could speed up nostr app development significantly by allowing devs to focus on what makes their client different instead of the boring parts that all share. I think I'll call it #ngine 👨‍🏭",
      created_at: 1701335754,
      id: "e1a1f30d98a241009cf3a723a6b149ceb212add0a3d918c6eb47508a6e49fb05",
      kind: 1,
      pubkey:
        "7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194",
      sig: "40158514e62095e8f503ab16c755fd68cede2462816a8001bd8879db7bf726fdb38b4f5f892ab59559e68a576a3072041ad3513adc2dae51949331fe65fcbacc",
      tags: [
        ["t", "ngine"],
        ["t", "ngine"],
      ],
    });
    return <Note event={event} {...props} />;
  },
  args: {},
};

export const Emojis: Story = {
  name: "Custom emojis",
  render(props) {
    const ndk = useNDK();
    const event = new NDKEvent(ndk, {
      content: ":belt::salmon::salmon::salmon::belt::salmon::salmon::belt:",
      created_at: 1684240980,
      id: "b66315466d5e887ae830504b2e4c0ecb1f527fecca116f2cdf0900c089b72c5f",
      kind: 1,
      pubkey:
        "cd408a69cc6c737ca1a76efc3fa247c6ca53ec807f6e7c9574164164797e8162",
      sig: "5fbe0ecd8285b90eaacf93ad8d0bd16f924259532904f58cad544b7aea51db677b852d55391d275601534212bb2e63c612fec04fea80e246d437ab6a10d34f4d",
      tags: [
        ["emoji", "belt", "https://awayuki.github.io/emoji/v1-040.png"],
        ["emoji", "salmon", "https://awayuki.github.io/emoji/v2-011.png"],
      ],
    });
    return <Note event={event} {...props} />;
  },
  args: {},
};
