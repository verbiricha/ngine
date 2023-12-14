import type { Meta, StoryObj } from "@storybook/react";
import { Markdown } from "@ngine/core";

const meta: Meta<typeof Markdown> = {
  title: "Components / Markdown",
  component: Markdown,
};

export default meta;

type Story = StoryObj<typeof Markdown>;

export const Primary: Story = {
  name: "Markup",
  args: {
    content: `
# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading


## Horizontal Rules

___

---

***

## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~

## Blockquotes

> Blockquotes can be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.

## Lists

Unordered

+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa
`,
  },
};

export const EventMentions: Story = {
  name: "Event mentions",
  args: {
    content: `
Any nostr entity can be mentioned and ngine will render it inline whenever is posible.

## Npub or Nprofile

Mentioning people by npub or nprofile is supported: nostr:nprofile1qqs8lft0t45k92c78n2zfe6ccvqzhpn977cd3h8wnl579zxhw5dvr9qf3fjwq

## Note or Nevent

Mentioning notes by note or nevent is supported:

nostr:nevent1qqsgluc3dzvtmt8m5s30xj82327e3ccr7m758j3sw33psuz6fn5gp0cpzamhxue69uhkvun9deejumn0wd68yvfwvdhk6tczypl62m6ad932k83u6sjwwkxrqq4cve0hkrvdem5la83g34m4rtqegqcyqqqqqqg8gc5p3

## Naddr

Mentioning replaceable events by their naddr identifier is also supported:

nostr:naddr1qqxnzdesxg6rzdp4xu6nzwpnqgsf03c2gsmx5ef4c9zmxvlew04gdh7u94afnknp33qvv3c94kvwxgsrqsqqqa28qyxhwumn8ghj7mn0wvhxcmmv3566f6

## Unknown kinds

If the event kind is unknown it'll allow users to open it in an app that supports it.

nostr:nevent1qqs22l7h6xg28s48eex2yjmqf426e3g6wu3hmc3wlwl6usuzxenh48gppemhxue69uhkummn9ekx7mp0qgs8lft0t45k92c78n2zfe6ccvqzhpn977cd3h8wnl579zxhw5dvr9q0hpznt
`,
  },
};

export const CustomEmoji: Story = {
  name: "Custom emoji",
  args: {
    content: `Markdown supports custom emoji :catJAM:!`,
    tags: [
      [
        "emoji",
        "catJAM",
        "https://cdn.betterttv.net/emote/5f1b0186cf6d2144653d2970/3x.webp",
      ],
    ],
  },
};
