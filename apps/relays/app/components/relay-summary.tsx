"use client"

import { useState, useEffect } from "react";

import {
  Stack,
  HStack,
  Box,
  Tag,
  Heading,
  Text,
  List,
  ListItem,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useInView } from "react-intersection-observer";
import { FormattedMessage } from "react-intl";
import { Amount, User } from "@ngine/core";

import Link from "./link";
import { useRelayMetadata, RelayMetadata } from "../hooks/useRelayMetadata";

interface RelaySummaryProps {
  info: RelayMetadata;
}

function Description({ info }: RelaySummaryProps) {
  const { description } = info;
  return description ? (
    <Text color="chakra-subtle-text">{description}</Text>
  ) : null;
}

function PayToRelay({ info }: RelaySummaryProps) {
  const { payments_url, fees } = info;
  return (
    <>
      {payments_url && (
        <>
          {fees?.admission && (
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
                    fees.admission[0].unit === "msats"
                      ? fees.admission[0].amount / 1000
                      : fees.admission[0].amount
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

function Nips({ info }: RelaySummaryProps) {
  const { supported_nips } = info;
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
                <Link isExternal variant="brand" href={`https://nips.be/${n}`}>
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

function Software({ info }: RelaySummaryProps) {
  const { software } = info;
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

function Countries({ info }: RelaySummaryProps) {
  const { relay_countries } = info;
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

function Operator({ info }: RelaySummaryProps) {
  const { pubkey, contact } = info;
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

function CommunityPreferences({ info }: RelaySummaryProps) {
  const { language_tags, tags, posting_policy } = info;
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

export function RelaySummaryInfo({ info }: RelaySummaryProps) {
  return (
    <Stack>
      <Description info={info} />
      <Nips info={info} />
      <Operator info={info} />
      <Software info={info} />
      <PayToRelay info={info} />
      <Countries info={info} />
      <CommunityPreferences info={info} />
    </Stack>
  );
}

function RelaySummaryFetch({ url }: { url: string }) {
  const { isError, data } = useRelayMetadata(url);
  if (isError) {
    return (
      <Alert status="error">
        <AlertIcon />
        <FormattedMessage
          id="relay-info-fetch-error"
          description="Error message when trying to fetch relay metadata"
          defaultMessage="Could not fetch relay metadata"
        />
      </Alert>
    );
  }
  return data ? <RelaySummaryInfo key={url} info={data} /> : null;
}

export default function RelaySummary({ url }: { url: string }) {
  const [isInView, setIsInView] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0,
  });
  useEffect(() => {
    if (inView) {
      setIsInView(true);
    }
  }, [inView]);
  return isInView ? (
    <RelaySummaryFetch key={url} url={url} />
  ) : (
    <div ref={ref}></div>
  );
}
