import { useMemo, useState, useEffect } from "react";
import { Box, Stack, StackProps, Button } from "@chakra-ui/react";
import { NDKFilter, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
import { FormattedMessage } from "react-intl";

import Event from "./Event";
import useEvents from "../hooks/useEvents";
import { Components } from "../types";

interface FeedProps extends Omit<StackProps, "filter"> {
  filter: NDKFilter | NDKFilter[];
  relays?: string[];
  pageSize?: number;
  components?: Components;
  cacheUsage?: NDKSubscriptionCacheUsage;
  closeOnEose?: boolean;
  hideShowMore?: boolean;
  hideLoadMore?: boolean;
}

interface FeedPageProps extends Omit<FeedProps, "closeOnEose"> {
  until: number;
}

function FeedPage({
  filter,
  relays,
  pageSize,
  until,
  cacheUsage = NDKSubscriptionCacheUsage.ONLY_RELAY,
  ...props
}: FeedPageProps) {
  const { events, eose } = useEvents(
    {
      ...filter,
      limit: pageSize,
      until,
    },
    {
      closeOnEose: true,
      cacheUsage,
    },
    relays,
  );
  return (
    <>
      {events.map((e) => (
        <Event key={e.id} event={e} {...props} />
      ))}
      {events.length > 0 && (
        <NextFeedPage
          filter={filter}
          relays={relays}
          pageSize={pageSize}
          cacheUsage={cacheUsage}
          until={(events[events.length - 1]?.created_at ?? 0) - 1}
          {...props}
        />
      )}
    </>
  );
}

function NextFeedPage(props: FeedPageProps) {
  const [loadMore, setLoadMore] = useState(false);
  return (
    <>
      {!loadMore && (
        <Button
          w="100%"
          variant="outline"
          onClick={() => setLoadMore(true)}
          colorScheme="brand"
        >
          <FormattedMessage
            id="ngine.load-more"
            description="Button for loading more in feed"
            defaultMessage="Load more"
          />
        </Button>
      )}
      {loadMore && <FeedPage {...props} />}
    </>
  );
}

export default function Feed({
  filter,
  relays,
  pageSize = 20,
  closeOnEose = false,
  cacheUsage = NDKSubscriptionCacheUsage.ONLY_RELAY,
  hideShowMore = false,
  hideLoadMore = false,
  ...props
}: FeedProps) {
  const [lastShown, setLastShown] = useState<string | undefined>();
  const { events, eose } = useEvents(
    {
      ...filter,
      limit: pageSize,
    },
    {
      closeOnEose,
      cacheUsage,
    },
    relays,
  );

  const toShow = useMemo(() => {
    if (!lastShown) {
      return events;
    }
    const idx = events.findIndex((e) => e.id === lastShown);
    return events.slice(idx, events.length);
  }, [lastShown, events]);

  const hidden = useMemo(() => {
    if (!lastShown) {
      return [];
    }
    const idx = events.findIndex((e) => e.id === lastShown);
    return events.slice(0, idx);
  }, [lastShown, events]);

  useEffect(() => {
    if (eose && events[0]) {
      setLastShown(events[0].id);
    }
  }, [eose]);

  function showHiddenEvents() {
    if (hidden[0]) {
      setLastShown(hidden[0].id);
    }
  }

  return (
    <>
      <Stack align="center" gap={3} {...props}>
        {!hideShowMore && !closeOnEose && (
          <Button
            isLoading={hidden.length === 0}
            w="100%"
            variant="outline"
            onClick={showHiddenEvents}
            colorScheme="brand"
          >
            <FormattedMessage
              id="ngine.show-more"
              description="Button for showing more in feed"
              defaultMessage="Show { count } more"
              values={{ count: hidden.length }}
            />
          </Button>
        )}
        {toShow.map((e) => (
          <Event key={e.id} event={e} {...props} />
        ))}
        {!hideLoadMore && eose && events.length > 0 && (
          <NextFeedPage
            filter={filter}
            relays={relays}
            pageSize={pageSize}
            cacheUsage={cacheUsage}
            until={(events[events.length - 1]?.created_at ?? 0) - 1}
            {...props}
          />
        )}
      </Stack>
    </>
  );
}
