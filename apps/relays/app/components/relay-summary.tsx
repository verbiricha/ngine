"use client";

import {
  Stack,
  HStack,
  Box,
  Tag,
  Heading,
  Text,
  List,
  ListItem,
} from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { Amount, User } from "@ngine/core";

import Link from "./link";
import { RelayMetadata } from "../hooks/useRelayMetadata";

interface RelaySummaryProps {
  metadata: RelayMetadata;
}

function Description({ metadata }: RelaySummaryProps) {
  const { description } = metadata;
  return description ? (
    <Text color="chakra-subtle-text">{description}</Text>
  ) : null;
}

function PayToRelay({ metadata }: RelaySummaryProps) {
  const { payments_url, fees } = metadata;
  const admission = fees?.admission;
  return (
    <>
      {payments_url && (
        <>
          {admission?.length > 0 && (
            <HStack justify="space-between">
              <Heading fontSize="lg">
                <FormattedMessage
                  id="admission-fee"
                  description="Admission fee section title"
                  defaultMessage="Admission fee"
                />
              </Heading>
              <Text>
                <Amount
                  amount={
                    admission[0].unit === "msats"
                      ? admission[0].amount / 1000
                      : admission[0].amount
                  }
                />
              </Text>
            </HStack>
          )}
          <HStack justify="space-between">
            <Heading fontSize="lg">
              <FormattedMessage
                id="pay-to-relay"
                description="Pay to relay fee section title"
                defaultMessage="Pay to Relay"
              />
            </Heading>
            <Link isExternal href={payments_url}>
              {payments_url}
            </Link>
          </HStack>
        </>
      )}
    </>
  );
}

function Nips({ metadata }: RelaySummaryProps) {
  const { supported_nips } = metadata;
  return (
    <>
      {supported_nips && supported_nips.length > 0 && (
        <Stack flexDir={{ base: "column", sm: "row" }} justify="space-between">
          <Heading fontSize="lg">
            <FormattedMessage
              id="nips"
              description="NIPs section title"
              defaultMessage="NIPs"
            />
          </Heading>
          <HStack flexWrap="wrap">
            {supported_nips.map((n: number) => (
              <Box key={n}>
                <Link
                  isExternal
                  variant="brand"
                  href={`https://github.com/nostr-protocol/nips/blob/master/${n.toLocaleString(
                    "en",
                    {
                      minimumIntegerDigits: 2,
                    },
                  )}.md`}
                >
                  {n}
                </Link>
              </Box>
            ))}
          </HStack>
        </Stack>
      )}
    </>
  );
}

function Software({ metadata }: RelaySummaryProps) {
  const { software } = metadata;
  return (
    <>
      {software && (
        <HStack justify="space-between">
          <Heading fontSize="lg">
            <FormattedMessage
              id="relay-software"
              description="Relay software section title"
              defaultMessage="Software"
            />
          </Heading>
          <Text>{software}</Text>
        </HStack>
      )}
    </>
  );
}

function getCountryName(countryCode: string) {
  const displayNames = new Intl.DisplayNames([], { type: "region" });
  return displayNames.of(countryCode);
}

function Countries({ metadata }: RelaySummaryProps) {
  const { relay_countries } = metadata;
  return (
    <>
      {relay_countries && (
        <HStack justify="space-between">
          <Heading fontSize="lg">
            <FormattedMessage
              id="relay-countries"
              description="Relay countries section title"
              defaultMessage="Countries"
            />
          </Heading>
          <HStack flexWrap="wrap">
            {relay_countries.map((n: string) => (
              <Box key={n}>{getCountryName(n)}</Box>
            ))}
          </HStack>
        </HStack>
      )}
    </>
  );
}

function isHexString(str: string) {
  const hexRegex = /^[a-fA-F0-9]{64}$/;
  return hexRegex.test(str);
}

function Operator({ metadata }: RelaySummaryProps) {
  const { pubkey, contact } = metadata;
  const hasOperator = isHexString(pubkey);
  return (
    <>
      {hasOperator && (
        <HStack justify="space-between">
          <Heading fontSize="lg">
            <FormattedMessage
              id="relay-operator"
              description="Relay operator section title"
              defaultMessage="Operator"
            />
          </Heading>
          <User pubkey={pubkey} size="xs" />
        </HStack>
      )}
      {contact && contact !== "unset" && !hasOperator && (
        <HStack justify="space-between">
          <Heading fontSize="lg">
            <FormattedMessage
              id="relay-contact"
              description="Relay contact section title"
              defaultMessage="Contact"
            />
          </Heading>
          <Text>{contact}</Text>
        </HStack>
      )}
    </>
  );
}

function getLanguageName(languageTag: string) {
  const displayNames = new Intl.DisplayNames([], { type: "language" });
  return displayNames.of(languageTag);
}

function CommunityPreferences({ metadata }: RelaySummaryProps) {
  const { language_tags, tags, posting_policy } = metadata;
  return (
    <>
      {language_tags && (
        <HStack justify="space-between">
          <Heading fontSize="lg">
            <FormattedMessage
              id="relay-languages"
              description="Relay languages section title"
              defaultMessage="Languages"
            />
          </Heading>
          <List>
            {language_tags.map((l: string) => (
              <ListItem>{getLanguageName(l)}</ListItem>
            ))}
          </List>
        </HStack>
      )}
      {tags && (
        <HStack justify="space-between">
          <Heading fontSize="lg">
            <FormattedMessage
              id="relay-tags"
              description="Relay tags section title"
              defaultMessage="Tags"
            />
          </Heading>
          <HStack flexWrap="wrap">
            {tags.map((t: string) => (
              <Box key={t}>
                <Tag>{t}</Tag>
              </Box>
            ))}
          </HStack>
        </HStack>
      )}
      {posting_policy && (
        <HStack justify="space-between">
          <Heading fontSize="lg">
            <FormattedMessage
              id="relay-policy"
              description="Relay posting policy section title"
              defaultMessage="Policy"
            />
          </Heading>
          <Link variant="brand" isExternal href={posting_policy}>
            {posting_policy}
          </Link>
        </HStack>
      )}
    </>
  );
}

export default function RelaySummary({ metadata }: RelaySummaryProps) {
  return (
    <Stack>
      <Description metadata={metadata} />
      <Nips metadata={metadata} />
      <Operator metadata={metadata} />
      <Software metadata={metadata} />
      <PayToRelay metadata={metadata} />
      <Countries metadata={metadata} />
      <CommunityPreferences metadata={metadata} />
    </Stack>
  );
}
