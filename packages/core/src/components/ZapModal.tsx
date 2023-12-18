import { useState, useMemo, useEffect } from "react";
import {
  Flex,
  Box,
  HStack,
  Stack,
  Button,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { FormattedNumber } from "react-intl";
import { generatePrivateKey, getPublicKey } from "nostr-tools";
import { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
//import("@getalby/bitcoin-connect-react"); // enable NWC
import { useIntl, FormattedMessage } from "react-intl";

import User from "./User";
import Amount from "./Amount";
import QrCode from "./QrCode";
import InputCopy from "./InputCopy";
import { useSign, useSigner } from "../context";
import { useSession, useRelays } from "../state";
import useFeedback from "../hooks/useFeedback";
import useProfile from "../hooks/useProfile";
import useProfiles from "../hooks/useProfiles";
import { useLnurl, useLnurls, loadInvoice } from "../lnurl";
import { useCurrency, useRates } from "../state";
import { convertSatsToFiat } from "../money";
import { makeZapRequest, getZapSplits, ZapSplit } from "../nostr/nip57";
import { Currency, Rates } from "../types";

function valueToEmoji(sats: number) {
  if (sats < 420) {
    return "👍";
  } else if (sats === 420) {
    return "😏";
  } else if (sats <= 1000) {
    return "🤙";
  } else if (sats <= 5000) {
    return "💜";
  } else if (sats <= 10000) {
    return "😻";
  } else if (sats <= 20000) {
    return "🤩";
  } else if (sats <= 50000) {
    return "🌶️";
  } else if (sats <= 600000) {
    return "🚀";
  } else if (sats < 1000000) {
    return "🔥";
  } else if (sats < 1500000) {
    return "🤯";
  } else {
    return "🏆";
  }
}

const defaultZapAmount = 21;

interface SatSliderProps {
  minSendable: number;
  maxSendable: number;
  onSelect(amt: number): void;
  currency: Currency;
  rates?: Rates;
}

function SatSlider({
  minSendable,
  maxSendable,
  onSelect,
  currency,
  rates,
}: SatSliderProps) {
  const [amount, setAmount] = useState(defaultZapAmount);
  const min = Math.max(1, Math.floor(minSendable / 1000));
  const max = Math.min(Math.floor(maxSendable / 1000), 2e6);
  const amounts = [
    defaultZapAmount,
    1_000,
    5_000,
    10_000,
    20_000,
    50_000,
    100_000,
    1_000_000,
    2_000_000,
  ];

  function selectAmount(a: number) {
    setAmount(a);
    onSelect(a);
  }

  function onInputChange(changed: number) {
    if (changed < min) {
      selectAmount(min);
    } else if (changed > max) {
      selectAmount(max);
    } else {
      selectAmount(changed);
    }
  }

  return (
    <Stack gap={2} width="100%">
      <Flex flexWrap="wrap" gap={3}>
        {amounts
          .filter((a) => a >= min && a <= max)
          .map((a) => {
            return (
              <Stack
                key={a}
                align="center"
                cursor="pointer"
                p={2}
                gap={0}
                flexGrow="1"
                borderRadius="16px"
                sx={{
                  bg: amount === a ? "brand.200" : "gray.100",
                  _dark: {
                    bg: amount === a ? "brand.400" : "gray.600",
                  },
                }}
                onClick={() => selectAmount(a)}
              >
                <Text as="span" fontSize="lg">
                  {valueToEmoji(a)}
                </Text>
                <Text as="span" fontWeight={700}>
                  <Amount amount={a} currency="BTC" />
                </Text>
                {rates && (
                  <Text as="span" fontSize="sm">
                    <FormattedNumber
                      value={Number(convertSatsToFiat(String(a), rates))}
                      style="currency"
                      currency={currency}
                    />
                  </Text>
                )}
              </Stack>
            );
          })}
      </Flex>
      <NumberInput
        defaultValue={defaultZapAmount}
        value={amount}
        min={min}
        max={max}
        onChange={(_, n) => onInputChange(n)}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      {rates && (
        <Text fontSize="sm" color="chakra-subtle-text">
          {amount} sats
          {" = "}
          <FormattedNumber
            value={Number(convertSatsToFiat(String(amount), rates))}
            style="currency"
            currency="USD"
          />
        </Text>
      )}
    </Stack>
  );
}

interface ZapModalProps {
  pubkey: string;
  event?: NDKEvent;
  isOpen: boolean;
  onClose(): void;
  currency: Currency;
  rates?: Rates;
}

function SingleZapModal({
  pubkey,
  event,
  isOpen,
  onClose,
  currency,
  rates,
}: ZapModalProps) {
  const { formatMessage } = useIntl();
  const sign = useSign();
  const toast = useFeedback();
  const relays = useRelays();
  const profile = useProfile(pubkey);
  const [amount, setAmount] = useState(defaultZapAmount);
  const session = useSession();
  const canSign = useSigner();
  const [isAnon, setIsAnon] = useState(!canSign);
  const [invoice, setInvoice] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [isFetchingInvoice, setIsFetchingInvoice] = useState(false);
  const { data: lnurl, isError, isLoading, isFetched } = useLnurl(profile);

  useEffect(() => {
    setIsAnon(!canSign);
  }, [canSign]);

  function closeModal() {
    setInvoice(null);
    setAmount(defaultZapAmount);
    setComment("");
    setIsFetchingInvoice(false);
    onClose();
  }

  async function zapRequest(sk: string) {
    try {
      const author =
        isAnon || !session?.pubkey ? getPublicKey(sk) : session?.pubkey;
      const zr = makeZapRequest({
        pubkey: author,
        p: pubkey,
        event,
        comment,
        amount,
        relays,
      });
      let signed;
      if (isAnon) {
        signed = await sign(zr, new NDKPrivateKeySigner(sk));
      } else {
        signed = await sign(zr);
      }
      if (signed) {
        return signed.toNostrEvent();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function onZap() {
    if (!lnurl) {
      return;
    }
    try {
      setIsFetchingInvoice(true);
      const sk = generatePrivateKey();
      const zr = await zapRequest(sk);
      const invoice = await loadInvoice(lnurl, amount, comment, zr);
      if (!invoice?.pr) {
        const msg = formatMessage({
          id: "ngine.invoice-fetch-fail",
          description: "Invoice fetching failed error message",
          defaultMessage: "Couldn't get invoice",
        });
        toast.error(msg);
        return;
      }
      // fimxe
      // @ts-ignore
      if (window.webln) {
        try {
          // @ts-ignore
          await window.webln.enable();
          // @ts-ignore
          await window.webln.sendPayment(invoice.pr);
          // todo: format amount?
          const msg = formatMessage(
            {
              id: "ngine.zap-sent",
              description: "Zap sent success message",
              defaultMessage: "{ amount } sent",
            },
            { amount },
          );
          toast.success(msg);
          closeModal();
        } catch (error) {
          console.error(error);
          setInvoice(invoice.pr);
        }
      } else {
        if (invoice?.pr) {
          setInvoice(invoice.pr);
        }
      }
    } catch (e) {
      console.error(e);
      const msg = formatMessage({
        id: "ngine.invoice-fetch-fail",
        description: "Invoice fetching failed error message",
        defaultMessage: "Couldn't get invoice",
      });
      toast.error(msg);
    } finally {
      setIsFetchingInvoice(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <FormattedMessage
              id="ngine.zapping"
              description="Zap modal title"
              defaultMessage="Zap"
            />
            <User pubkey={pubkey} />
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack alignItems="center" minH="4rem">
            {isLoading && <Spinner />}
            {isError && (
              <Alert
                status="warning"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="120px"
              >
                <AlertIcon />
                <AlertTitle>Can't zap</AlertTitle>
                <AlertDescription maxWidth="sm">
                  The user can't be zapped because we can't fetch their LNURL
                  information.
                </AlertDescription>
              </Alert>
            )}
            {lnurl && !invoice && (
              <Stack spacing={2}>
                <SatSlider
                  currency="USD"
                  rates={rates}
                  minSendable={lnurl.minSendable}
                  maxSendable={lnurl.maxSendable}
                  onSelect={setAmount}
                />
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Comment (optional)"
                />
                <RadioGroup
                  mt={2}
                  defaultValue={isAnon ? "private" : "public"}
                  onChange={(value) => setIsAnon(value === "private")}
                >
                  <Stack spacing={2} direction="row">
                    <Radio
                      colorScheme="brand"
                      value="public"
                      isDisabled={!canSign}
                    >
                      <FormattedMessage
                        id="ngine.zaps-public"
                        description="Public zap selector"
                        defaultMessage="Public"
                      />
                    </Radio>
                    <Radio colorScheme="brand" value="private">
                      <FormattedMessage
                        id="ngine.zaps-anonymous"
                        description="Anonymous zap selector"
                        defaultMessage="Anonymous"
                      />
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Stack>
            )}
            {lnurl && invoice && (
              <Stack align="center">
                <QrCode data={invoice} />
                <InputCopy text={invoice} />
                <Button
                  variant="solid"
                  colorScheme="orange"
                  onClick={() => window.open(`lightning:${invoice}`)}
                >
                  <FormattedMessage
                    id="ngine.open-in-wallet"
                    description="Open invoice in wallet"
                    defaultMessage="Open in wallet"
                  />
                </Button>
              </Stack>
            )}
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            isDisabled={!isFetched || !lnurl}
            isLoading={isLoading || isFetchingInvoice}
            w="12em"
            variant="solid"
            colorScheme="brand"
            onClick={onZap}
          >
            <FormattedMessage
              id="ngine.zap"
              description="Zap button"
              defaultMessage="Zap { amount }"
              values={{
                amount: <Amount amount={amount} currency={currency} />,
              }}
            />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

interface MultiZapModalProps extends ZapModalProps {
  zapSplits: ZapSplit[];
}

function MultiZapModal({
  event,
  zapSplits,
  isOpen,
  onClose,
  currency,
  rates,
}: MultiZapModalProps) {
  const { formatMessage } = useIntl();
  const sign = useSign();
  const toast = useFeedback();
  const relays = useRelays();
  const pubkeys = useMemo(() => {
    return zapSplits.map((z) => z.pubkey);
  }, [zapSplits]);
  const [isFetchingInvoices, setIsFetchingInvoices] = useState(false);
  const profiles = useProfiles(pubkeys);
  const results = useLnurls(profiles);
  const lnurls = results.map((result) => result.data).filter((l) => l);
  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);
  const isFetched = results.every((result) => result.isFetched);
  const [amount, setAmount] = useState(defaultZapAmount);
  const session = useSession();
  const canSign = useSigner();
  const [isAnon, setIsAnon] = useState(!canSign);
  const [invoices, setInvoices] = useState<string[] | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    setIsAnon(!canSign);
  }, [canSign]);

  function closeModal() {
    setInvoices(null);
    setAmount(defaultZapAmount);
    setComment("");
    setIsFetchingInvoices(false);
    onClose();
  }

  async function zapRequest(sk: string, p: string, amount: number) {
    try {
      const author =
        isAnon || !session?.pubkey ? getPublicKey(sk) : session?.pubkey;
      const zr = makeZapRequest({
        pubkey: author,
        p,
        amount,
        relays,
        event,
        comment,
      });
      let signed;
      if (isAnon) {
        signed = await sign(zr, new NDKPrivateKeySigner(sk));
      } else {
        signed = await sign(zr);
      }
      if (signed) {
        return signed.toNostrEvent();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function onZap() {
    try {
      const sk = generatePrivateKey();
      setIsFetchingInvoices(true);
      const fetchedInvoices = await Promise.all(
        zapSplits.map(async ({ pubkey, percentage }, idx) => {
          const gets = Math.round(amount * (percentage / 100));
          const zr = await zapRequest(sk, pubkey, gets);
          // @ts-ignore
          return await loadInvoice(lnurls[idx], gets, comment, zr);
        }),
      );
      const hasFetchedInvoices = fetchedInvoices.every((i) => i?.pr);

      if (!hasFetchedInvoices) {
        const msg = formatMessage({
          id: "ngine.invoice-fetch-fail",
          description: "Invoice fetching failed error message",
          defaultMessage: "Couldn't get invoice",
        });
        toast.error(msg);
        return;
      }

      // @ts-ignore
      if (window.webln) {
        try {
          // @ts-ignore
          await window.webln.enable();
          for (const i of fetchedInvoices) {
            // @ts-ignore
            await window.webln.sendPayment(i.pr);
          }
          const msg = formatMessage(
            {
              id: "ngine.zap-sent",
              description: "Zap sent success message",
              defaultMessage: "{ amount } sent",
            },
            { amount },
          );
          toast.success(msg);
          closeModal();
        } catch (error) {
          console.error(error);
          setInvoices(fetchedInvoices.map((i) => i.pr));
        }
      } else {
        setInvoices(fetchedInvoices.map((i) => i.pr));
      }
    } catch (e) {
      console.error(e);
      const msg = formatMessage({
        id: "ngine.invoice-fetch-fail",
        description: "Invoice fetching failed error message",
        defaultMessage: "Couldn't get invoice",
      });
      toast.error(msg);
    } finally {
      setIsFetchingInvoices(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <FormattedMessage
            id="ngine.zapping-recipients"
            description="Zap split modal title"
            defaultMessage="Zap { count } recipients"
            values={{ count: zapSplits.length }}
          />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack alignItems="center" minH="4rem">
            {isLoading && <Spinner />}
            {isError && (
              <Alert
                status="warning"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="120px"
              >
                <AlertIcon />
                <AlertTitle>Can't zap</AlertTitle>
                <AlertDescription maxWidth="sm">
                  The users can't be zapped because we can't fetch their LNURL
                  information.
                </AlertDescription>
              </Alert>
            )}
            {lnurls && !invoices && (
              <>
                <SatSlider
                  currency="USD"
                  rates={rates}
                  minSendable={Math.max(
                    ...lnurls.map((l) => l!.minSendable ?? 21),
                  )}
                  maxSendable={Math.min(
                    ...lnurls.map((l) => l!.maxSendable ?? 21_000_000),
                  )}
                  onSelect={setAmount}
                />
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Leave a comment (optional)"
                />
                <RadioGroup
                  mt={2}
                  defaultValue={isAnon ? "private" : "public"}
                  onChange={(value) => setIsAnon(value === "private")}
                >
                  <Stack spacing={2} direction="row">
                    <Radio
                      colorScheme="brand"
                      value="public"
                      isDisabled={!canSign}
                    >
                      Public
                    </Radio>
                    <Radio colorScheme="brand" value="private">
                      Anonymous
                    </Radio>
                  </Stack>
                </RadioGroup>
              </>
            )}
            {lnurls &&
              invoices &&
              invoices.map((invoice) => {
                return (
                  <Stack align="center" key={invoice}>
                    <QrCode data={invoice} />
                    <Stack>
                      <InputCopy text={invoice} />
                      <Button
                        colorScheme="orange"
                        onClick={() => window.open(`lightning:${invoice}`)}
                      >
                        <FormattedMessage
                          id="ngine.open-in-wallet"
                          description="Open invoice in wallet"
                          defaultMessage="Open in wallet"
                        />
                      </Button>
                    </Stack>
                  </Stack>
                );
              })}
            <Stack w="100%">
              {zapSplits.map(({ pubkey, percentage }) => {
                const gets = Math.round(amount * (percentage / 100));
                return (
                  <Flex
                    key={pubkey}
                    align="center"
                    justifyContent="space-between"
                  >
                    <User key={pubkey} pubkey={pubkey} size="xs" />
                    <Flex
                      alignItems="flex-end"
                      flexDir="column"
                      justifyContent="flex-end"
                    >
                      <Text as="span" fontSize="md">
                        {Number(percentage.toFixed(0))}%
                      </Text>
                      <Text color="secondary" as="span" fontSize="sm">
                        <Amount amount={gets} currency={currency} />
                      </Text>
                    </Flex>
                  </Flex>
                );
              })}
            </Stack>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            isDisabled={
              !isFetched ||
              lnurls.length !== pubkeys.length ||
              invoices !== null
            }
            isLoading={isLoading || isFetchingInvoices}
            w="12em"
            variant="solid"
            colorScheme="brand"
            onClick={onZap}
          >
            <FormattedMessage
              id="ngine.zap"
              description="Zap button"
              defaultMessage="Zap { amount }"
              values={{
                amount: <Amount amount={amount} currency={currency} />,
              }}
            />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

interface OptionalZapModalProps {
  pubkey: string;
  event?: NDKEvent;
  isOpen: boolean;
  onClose(): void;
}

export default function ZapModal({
  pubkey,
  event,
  isOpen,
  onClose,
}: OptionalZapModalProps) {
  const currency = useCurrency();
  const rates = useRates();
  const zapSplits = useMemo(() => {
    if (event) {
      return getZapSplits(event);
    }
    return [];
  }, [event]);
  return zapSplits.length > 0 ? (
    <MultiZapModal
      pubkey={pubkey}
      event={event}
      zapSplits={zapSplits}
      isOpen={isOpen}
      onClose={onClose}
      currency={currency}
      rates={rates}
    />
  ) : (
    <SingleZapModal
      pubkey={pubkey}
      event={event}
      isOpen={isOpen}
      onClose={onClose}
      currency={currency}
      rates={rates}
    />
  );
}
