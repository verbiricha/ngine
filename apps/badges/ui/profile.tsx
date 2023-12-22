import type { ReactNode } from "react";
import {
  Flex,
  Box,
  Stack,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import {
  NDKKind,
  NDKEvent,
  NDKSubscriptionCacheUsage,
} from "@nostr-dev-kit/ndk";
import { useEvents, useProfile, Username, Markdown } from "@ngine/core";

import Avatar from "./avatar";
import Badge from "./badge";
import BadgeAward from "./badge-award";
import Grid from "./grid";
import useBadges from "@hooks/useBadges";

function ProfileTabs({
  badges,
  awards,
  created,
}: {
  badges: NDKEvent[];
  awards: NDKEvent[];
  created: NDKEvent[];
}) {
  return (
    <Tabs variant="solid-rounded" colorScheme="gray">
      <TabList>
        <Tab>{badges.length} collected</Tab>
        <Tab>{awards.length} awarded</Tab>
        <Tab>{created.length} created</Tab>
      </TabList>

      <TabPanels>
        <TabPanel px={0}>
          <Grid>
            {badges.slice(1, badges.length).map((e) => (
              <Badge key={e.id} event={e} />
            ))}
          </Grid>
        </TabPanel>
        <TabPanel px={0}>
          <Grid>
            {awards.map((e) => (
              <BadgeAward key={e.id} event={e} />
            ))}
          </Grid>
        </TabPanel>
        <TabPanel px={0}>
          <Grid>
            {created.map((e) => (
              <Badge key={e.id} event={e} />
            ))}
          </Grid>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default function Profile({ pubkey }: { pubkey: string }) {
  const profile = useProfile(pubkey);
  const { events: created } = useEvents(
    {
      kinds: [NDKKind.BadgeDefinition],
      authors: [pubkey],
    },
    {
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
    },
  );
  const { badges, awards } = useBadges(pubkey);
  const highlighted = badges[0];
  return (
    <Stack gap={6}>
      <Flex
        align="center"
        flexDir={{ base: "column", md: "row" }}
        justify="space-between"
        gap={4}
      >
        <Flex
          align={{ base: "center", md: "flex-start" }}
          direction={{ base: "column", md: "row " }}
          gap={5}
        >
          <Avatar pubkey={pubkey} size="xl" />
          <Stack gap={3}>
            <Username
              pubkey={pubkey}
              fontSize="4xl"
              fontWeight={700}
              textAlign={{
                base: "center",
                md: "left",
              }}
            />
            {profile?.about && (
              <Markdown
                content={profile.about}
                color="chakra-subtle-text"
                fontSize="sm"
                maxW="sm"
                textAlign={{
                  base: "center",
                  md: "left",
                }}
              />
            )}
          </Stack>
        </Flex>
        {highlighted && <Badge key={highlighted.id} event={highlighted} />}
      </Flex>
      <ProfileTabs badges={badges} awards={awards} created={created} />
    </Stack>
  );
}
