import { useMemo } from "react";
import {
  HStack,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuList,
  MenuItem,
  Button,
  Text,
  Image,
  Icon,
} from "@chakra-ui/react";
import NDK, {
  NDKEvent,
  NDKKind,
  NDKFilter,
  NDKSubscriptionCacheUsage,
} from "@nostr-dev-kit/ndk";
import { useQuery } from "@tanstack/react-query";
import { FormattedMessage } from "react-intl";

import AvatarGroup from "./AvatarGroup";
import { useNDK } from "../context";
import { useSession, useContacts } from "../state";
import { tagValues } from "../tags";
import { dedupe, parseJSON } from "../utils";
import { EventProps } from "../types";
import { Star, ChevronDown } from "../icons";
import { addressesToFilter } from "../filter";

async function queryReccommendedApps(
  ndk: NDK,
  event: NDKEvent,
  contacts: string[],
  pubkey?: string,
) {
  const reccs = [
    ...(await ndk.fetchEvents(
      {
        kinds: [NDKKind.AppRecommendation],
        "#d": [String(event.kind)],
      },
      {
        closeOnEose: true,
        cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
      },
    )),
  ];

  const recommendedApps = reccs.reduce(
    (acc, ev) => {
      const addresses = tagValues(ev, "a").filter((a) =>
        a.startsWith(`${NDKKind.AppHandler}:`),
      );
      for (const address of addresses) {
        const soFar = acc[address] ?? [];
        acc[address] = dedupe(soFar.concat([ev.pubkey]));
      }
      return acc;
    },
    {} as Record<string, string[]>,
  );

  const filter = addressesToFilter(Object.keys(recommendedApps));

  if (filter?.authors?.length === 0) {
    return [];
  }

  const events = [
    ...(await ndk.fetchEvents(filter, {
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
    })),
  ];

  return events
    .sort((a, b) => {
      const aRecommendations = recommendedApps[a.tagId()];
      const aNetworkReccomendations = aRecommendations.reduce((acc, pk) => {
        if (pk === pubkey) {
          return acc + 42;
        }
        if (contacts.includes(pk)) {
          return acc + 1;
        }
        return acc;
      }, 0);
      const aScore = aRecommendations.length + aNetworkReccomendations;
      const bRecommendations = recommendedApps[b.tagId()];
      const bNetworkReccomendations = bRecommendations.reduce((acc, pk) => {
        if (pk === pubkey) {
          return acc + 42;
        }
        if (contacts.includes(pk)) {
          return acc + 1;
        }
        return acc;
      }, 0);
      const bScore = bRecommendations.length + bNetworkReccomendations;
      return bScore - aScore;
    })
    .map((ev) => {
      return { ev, recommenders: recommendedApps[ev.tagId()] };
    })
    .slice(0, 10);
}

function useRecommendedApps(event: NDKEvent) {
  const ndk = useNDK();
  const contacts = useContacts();
  const session = useSession();
  const pubkey = session?.pubkey;
  const query = useQuery({
    queryKey: ["nip-89", event.kind],
    queryFn: async () => {
      return queryReccommendedApps(ndk, event, contacts, pubkey);
    },
    retry: false,
    refetchOnMount: false,
  });
  return query;
}

function AppMenuItem({
  event,
  unknownEvent,
  recommenders,
}: {
  event: NDKEvent;
  unknownEvent: NDKEvent;
  recommenders: string[];
}) {
  const session = useSession();
  const pubkey = session?.pubkey;
  const isPreferredApp = useMemo(() => {
    return recommenders.includes(pubkey as string);
  }, [recommenders, pubkey]);
  const app = useMemo(() => parseJSON(event.content, null), [event]);
  const markers = unknownEvent.isParamReplaceable()
    ? ["", "naddr", "nevent"]
    : ["", "note", "nevent"];
  const handler = event.tags.find((t) => markers.includes(t[2]));
  const url = useMemo(() => {
    if (handler) {
      const template = handler[1];
      return template.replace("<bech32>", unknownEvent.encode());
    }
  }, [handler]);

  function onClick() {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  return app ? (
    <MenuItem isDisabled={!url} onClick={onClick}>
      <HStack w="100%" gap={8} justify="space-between">
        <HStack>
          {(app.picture || app.image) && (
            <Image width="21px" height="21px" src={app.picture || app.image} />
          )}
          {isPreferredApp ? (
            <HStack>
              <Text>{app.display_name || app.name}</Text>
              <Icon as={Star} boxSize={4} color="chakra-subtle-text" />
            </HStack>
          ) : (
            <Text>{app.display_name || app.name}</Text>
          )}
        </HStack>
        <AvatarGroup
          size="xs"
          sx={{ pointerEvents: "none" }}
          pubkeys={recommenders}
        />
      </HStack>
    </MenuItem>
  ) : null;
}

interface RecommendedAppMenuProps extends EventProps, MenuButtonProps {}

export default function RecommendedAppMenu({
  event,
  ...props
}: RecommendedAppMenuProps) {
  const { data: recommended, isLoading } = useRecommendedApps(event);
  return (
    <Menu isLazy>
      <MenuButton
        as={Button}
        variant="outline"
        colorScheme="brand"
        isLoading={isLoading}
        isDisabled={recommended?.length === 0}
        size={{ base: "xs", sm: "sm" }}
        rightIcon={<Icon as={ChevronDown} />}
        {...props}
      >
        <FormattedMessage
          id="ngine.open-app"
          description="Open app selector"
          defaultMessage="Open"
        />
      </MenuButton>
      <MenuList>
        {recommended?.map(({ ev, recommenders }) => (
          <AppMenuItem
            key={ev.tagId()}
            unknownEvent={event}
            event={ev}
            recommenders={recommenders}
          />
        ))}
      </MenuList>
    </Menu>
  );
}
