import type { Meta, StoryObj } from "@storybook/react";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useNDK, Article } from "@ngine/core";

const meta: Meta<typeof Article> = {
  title: "Components / Article",
  component: Article,
};

export default meta;

type Story = StoryObj<typeof Article>;

export const Primary: Story = {
  name: "Article",
  render(props) {
    const ndk = useNDK();
    const event = new NDKEvent(ndk, {
      created_at: 1700654091,
      content:
        "I'm happy to announce a new release of [Habla](https://habla.news).\n\nnostr:naddr1qqxnzd3cxuenywfk8ycnqvenqgs86nsy2qatyes4m40jnmqgk5558jl979a6escp9vnzyr92yv4tznqrqsqqql8kqyt8wumn8ghj7un9d3shjtnwdaehgu3wvfskueqj576ks\n\n## Improved interoperability\n\nnostr:nevent1qqsr2kvqxf5nfkxsymtptcpk5hls0uywz65nmaf3u4jn09vgypjq54gpzemhxue69uhhyetvv9ujumn0wd68ytnzv9hxg4tfn9f\n\n## NIP-31\n\n[Habla](https://habla.news) now adds an `alt` tags to articles and highlights as per [NIP-31](https://nips.be/31). This means that clients that don't support the long form event (kind 30023) or highlights (kind 9802) can still display a brief text explaining the event.\n\n## NIP-89\n\n[Habla](https://habla.news) now adds and inteprets the `client` tag as per [NIP-89](https://nips.be/89). The long form note detail view will show and link to the client that was used to compose the post. This makes it easy for users to find alternative clients that support long form.\n\nWhen mentioning an event that is not supported by [Habla](https://habla.news) it'll use the [NIP-89](https://nips.be/89) application handlers to offer you options for viewing it in another client. The resulting apps will be scored by you and your network's endorsement.\n\nAs part of the housekeeping we've removed support for a few embedded kinds such as badges or live events.\n\nnostr:naddr1qq9rzd3c8qenzv34xgesygz47pzeqe60xey0fnwfmjxwxtdz52pqwnxskqs9jmhqx0gj6wz3s5psgqqqwenslj8h0y\n\nThis is not a problem since all known and unknown events will show a \"Open with\" menu for opening the event in another app.\n\nnostr:naddr1qqyrzcmy8ycrgce3qy8hwumn8ghj7mn0wd68ytnddaksygqhw9adf5sw9fp9eks2yx2kyjs2ffeufa5htuttzkflepl6gmedtqpsgqqq0j6qgsqmjn\n\nCheck out [nostrapp](https://nostrapp.link/) for a nostr app directory where you can endorse and review your favorite apps.\n\nnostr:naddr1qqxnzd3cx5urqvf3xserqdenqgsgrz3ekhckgg6lscj5kyk2tph0enqljh5ck3wtrjguw8w9m9yxmksrqsqqql8kqyt8wumn8ghj7un9d3shjtnwdaehgu3wvfskueqrae0ax\n\n## Bookmarks\n\nYou can now create bookmark lists and store highlights and articles on them. Profiles now have a \"Bookmarks\" section for checking out other people's bookmarks. Your bookmarks are quickly accessible in the sidebar, just click the bookmark icon.\n\nBookmarks follow the recently modified [NIP-51](https://nips.be/51) specification.\n\n## Recurring subscriptions\n\nI am very excited about recurring subscriptions and luckily there is a [PR](https://github.com/nostr-protocol/nips/pull/866) being discussed for bringing this functionality to nostr. Since the spec is still in flux we only show who supports you and who are you supporting on your profile. I'll add the option to support your favorite writers once the spec is finalized.\n\n---\n\nThat's all, frens! Sorry for being quiet lately but I've been traveling and taking some time off to spend with my family.\n\nHappy reading, writing, bookmarking and discovering nostr apps!\n",
      tags: [
        ["d", "interop"],
        ["title", "Habla release: Interop is OP"],
        ["summary", ""],
        ["published_at", "1700654091"],
        ["t", "habla"],
        ["t", "nostr"],
        ["t", "nip-89"],
        ["t", "nip-31"],
        [
          "alt",
          "This is a long form article, you can read it in https://habla.news/verbiricha/interop",
        ],
        [
          "client",
          "31990:7d4e04503ab26615dd5f29ec08b52943cbe5f17bacc3012b26220caa232ab14c:1687329691033",
          "wss://relay.nostr.band",
          "web",
        ],
        [
          "e",
          "355980326934d8d026d615e036a5ff07f08e16a93df531e56537958820640a55",
        ],
      ],
      kind: 30023,
      pubkey:
        "7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194",
      id: "34500c37a917157a3f18112cc525d85ae5f42e2c4f2297e6e50f1facc17dae41",
      sig: "23726426ac43170ad30d2baebf838e4867d9254947c7df0c1725b5644e783f4e55e9830afc4767ef739b01625d65f9b491bf0cd73f46b320b131f2f826daebb3",
    });
    return <Article event={event} {...props} />;
  },
  args: {},
};
