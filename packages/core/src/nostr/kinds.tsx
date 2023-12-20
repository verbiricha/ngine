import { NDKKind } from "@nostr-dev-kit/ndk";

export const REPOSTS = [NDKKind.Repost, NDKKind.GenericRepost];

export const BOOKMARKS = [
  NDKKind.BookmarkList,
  NDKKind.CategorizedBookmarkList,
  NDKKind.RelayList,
  NDKKind.EmojiList,
];
