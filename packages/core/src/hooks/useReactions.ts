import { useMemo } from "react";
import {
  NDKEvent,
  NDKFilter,
  NDKKind,
  NDKSubscriptionCacheUsage,
} from "@nostr-dev-kit/ndk";

import useEvents from "./useEvents";
import { zapsSummary, ZapRequest } from "../nostr/nip57";
import { ReactionKind } from "../types";

export type ReactionEvents = {
  events: NDKEvent[];
  zaps: {
    zapRequests: ZapRequest[];
    total: number;
  };
  reactions: NDKEvent[];
  replies: NDKEvent[];
  reposts: NDKEvent[];
  bookmarks: NDKEvent[];
};

export default function useReactions(
  event: NDKEvent,
  kinds: ReactionKind[],
  live = true,
): ReactionEvents {
  const filter = useMemo(() => {
    return {
      kinds,
      ...event.filter(),
    } as NDKFilter;
  }, [event, kinds]);
  const { events } = useEvents(filter, {
    disable: !live,
    closeOnEose: false,
    cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
  });
  const zaps = useMemo(
    () => events.filter((e) => e.kind === NDKKind.Zap),
    [events],
  );
  const { zapRequests, total } = useMemo(() => zapsSummary(zaps), [zaps]);
  const reactions = useMemo(
    () => events.filter((e) => e.kind === NDKKind.Reaction),
    [events],
  );
  const replies = useMemo(
    () => events.filter((e) => e.kind === NDKKind.Text),
    [events],
  );
  const reposts = useMemo(
    () =>
      events.filter(
        (e) => e.kind === NDKKind.Repost || e.kind === NDKKind.GenericRepost,
      ),
    [events],
  );
  const bookmarks = useMemo(
    () =>
      events.filter(
        (e) =>
          e.kind === NDKKind.BookmarkList ||
          e.kind === NDKKind.CategorizedBookmarkList ||
          e.kind === NDKKind.RelayList ||
          e.kind === NDKKind.EmojiList,
      ),
    [events],
  );
  return {
    events,
    zaps: {
      zapRequests,
      total,
    },
    reactions,
    replies,
    reposts,
    bookmarks,
  };
}
