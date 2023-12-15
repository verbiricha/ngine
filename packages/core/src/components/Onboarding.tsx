import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  useSteps,
  Stack,
  Box,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Textarea,
  Button,
  Link,
} from "@chakra-ui/react";
import { atom, useAtom, useAtomValue } from "jotai";
import { NDKKind, NDKEvent, NostrEvent } from "@nostr-dev-kit/ndk";
import { generatePrivateKey, getPublicKey } from "nostr-tools";
import { useIntl, FormattedMessage, MessageDescriptor } from "react-intl";

import ImagePicker from "./ImagePicker";
import { useNDK, useNsecLogin } from "../context";
import { relayListAtom, followsAtom } from "../state";
import { unixNow } from "../time";
import type { Relay } from "../types";
import useFeedback from "../hooks/useFeedback";

interface Profile {
  name: string;
  about: string;
  picture?: string;
  lud16?: string;
}

const initialProfile = { name: "", about: "" };
const initialFollowing = [] as string[][];

const profileAtom = atom<Profile>(initialProfile);
const followingAtom = atom<string[][]>(initialFollowing);

function NameStep() {
  const [profile, setProfile] = useAtom(profileAtom);
  const { formatMessage } = useIntl();
  return (
    <Stack gap={4}>
      <FormControl>
        <FormLabel>
          <FormattedMessage
            id="ngine.onboarding.your-name"
            description="Onboarding name label"
            defaultMessage="What we will call you?"
          />
        </FormLabel>
        <Input
          placeholder={formatMessage({
            id: "ngine.onboarding.name-placeholder",
            description: "Onboarding name placeholder",
            defaultMessage: "Samantha",
          })}
          value={profile.name}
          onChange={(ev) => setProfile({ ...profile, name: ev.target.value })}
        />
        <FormHelperText>
          <FormattedMessage
            id="ngine.onboarding.your-name-helper"
            description="Onboarding name helper text"
            defaultMessage="You can change it layer if you like."
          />
        </FormHelperText>
      </FormControl>
    </Stack>
  );
}

function BioStep() {
  const [profile, setProfile] = useAtom(profileAtom);
  const { formatMessage } = useIntl();
  return (
    <Stack gap={4}>
      <FormControl>
        <FormLabel>
          <FormattedMessage
            id="ngine.onboarding.bio"
            description="Onboarding bio label"
            defaultMessage="Tell the world about you"
          />
        </FormLabel>
        <Textarea
          placeholder={formatMessage({
            id: "ngine.onboarding.bio-placeholder",
            description: "Onboarding bio placeholder",
            defaultMessage: "A few words about yourself",
          })}
          value={profile.about}
          onChange={(ev) => setProfile({ ...profile, about: ev.target.value })}
        />
        <FormHelperText>
          <FormattedMessage
            id="ngine.onboarding.bio-helper"
            description="Onboarding bio helper text"
            defaultMessage="This is optional and you can change it later if you like."
          />
        </FormHelperText>
      </FormControl>
    </Stack>
  );
}

function AvatarStep() {
  const [profile, setProfile] = useAtom(profileAtom);
  function onImageUpload(img: string) {
    setProfile({ ...profile, picture: img });
  }
  return (
    <FormControl>
      <FormLabel>
        <FormattedMessage
          id="ngine.onboarding.avatar"
          description="Onboarding avatar label"
          defaultMessage="Add a profile image"
        />
      </FormLabel>
      <ImagePicker
        defaultImage={profile.picture}
        onImageUpload={onImageUpload}
      />
    </FormControl>
  );
}

function WalletStep() {
  const [profile, setProfile] = useAtom(profileAtom);
  return (
    <Stack gap={4}>
      <FormControl>
        <FormLabel>
          <FormattedMessage
            id="ngine.onboarding.ln-address"
            description="Onboarding ln address label"
            defaultMessage="Lightning address"
          />
        </FormLabel>
        <Input
          value={profile.lud16}
          onChange={(ev) => setProfile({ ...profile, lud16: ev.target.value })}
        />
        <FormHelperText>
          <FormattedMessage
            id="ngine.onboarding.ln-address-helper"
            description="Onboarding ln address helper text"
            defaultMessage="A lightning address allows you to receive payments from anyone in the world."
          />
        </FormHelperText>
      </FormControl>
    </Stack>
  );
}

function InterestsStep() {
  return <>TODO</>;
}

function PeopleStep() {
  return <>TODO</>;
}

export enum OnboardingStep {
  Name = "Name",
  Bio = "Bio",
  Avatar = "Avatar",
  Wallet = "Wallet",
  Interests = "Interests",
  People = "People",
}

const stepComponents: Record<OnboardingStep, ReactNode> = {
  [OnboardingStep.Name]: <NameStep />,
  [OnboardingStep.Bio]: <BioStep />,
  [OnboardingStep.Avatar]: <AvatarStep />,
  [OnboardingStep.Wallet]: <WalletStep />,
  [OnboardingStep.Interests]: <InterestsStep />,
  [OnboardingStep.People]: <PeopleStep />,
};

const stepName: Record<OnboardingStep, MessageDescriptor> = {
  [OnboardingStep.Name]: {
    id: "ngine.onboarding.name-step",
    description: "Onboarding name step title",
    defaultMessage: "Name",
  },
  [OnboardingStep.Bio]: {
    id: "ngine.onboarding.bio-step",
    description: "Onboarding bio step title",
    defaultMessage: "Bio",
  },
  [OnboardingStep.Avatar]: {
    id: "ngine.onboarding.avatar-step",
    description: "Onboarding avatar step title",
    defaultMessage: "Avatar",
  },
  [OnboardingStep.Wallet]: {
    id: "ngine.onboarding.wallet-step",
    description: "Onboarding wallet step title",
    defaultMessage: "Wallet",
  },
  [OnboardingStep.Interests]: {
    id: "ngine.onboarding.interests-step",
    description: "Onboarding interests step title",
    defaultMessage: "Interests",
  },
  [OnboardingStep.People]: {
    id: "ngine.onboarding.people-step",
    description: "Onboarding people step title",
    defaultMessage: "People",
  },
};

interface OnboardingProps {
  steps?: OnboardingStep[];
  defaultRelays?: Relay[];
  onFinish: () => void;
}

const defaultSteps = [
  OnboardingStep.Name,
  OnboardingStep.Bio,
  OnboardingStep.Avatar,
  OnboardingStep.Wallet,
];

export default function Onboarding({
  steps = defaultSteps,
  defaultRelays,
  onFinish,
}: OnboardingProps) {
  const { formatMessage } = useIntl();
  const ndk = useNDK();
  const toast = useFeedback();
  const nsecLogin = useNsecLogin();
  const userRelays = defaultRelays || [
    { url: "wss://frens.nostr1.com", read: true, write: true },
    { url: "wss://nos.lol", read: true, write: true },
    { url: "wss://nostr.mom", read: true, write: true },
    { url: "wss://relay.damus.io", read: true, write: true },
    { url: "wss://relay.nostr.band", read: true, write: false },
  ];
  const [, setRelays] = useAtom(relayListAtom);
  const [, setProfile] = useAtom(profileAtom);
  const [, setFollowing] = useAtom(followingAtom);
  const [, setFollows] = useAtom(followsAtom);
  const [isBusy, setIsBusy] = useState(false);
  const profile = useAtomValue(profileAtom);
  const follows = useAtomValue(followingAtom);

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });
  const isLastStep = activeStep === steps.length;

  useEffect(() => {
    return () => {
      setProfile(initialProfile);
      setFollowing(initialFollowing);
    };
  }, []);

  function onNext() {
    if (isLastStep) {
      createProfile();
    } else {
      setActiveStep(activeStep + 1);
    }
  }

  async function publishEvent(ev: NostrEvent): Promise<NDKEvent> {
    const signed = new NDKEvent(ndk, ev);
    await signed.sign();
    await signed.publish();
    return signed;
  }

  async function createProfile() {
    const sk = generatePrivateKey();
    const pubkey = getPublicKey(sk);
    try {
      setIsBusy(true);
      await nsecLogin(sk);
      // Profile
      const metadata = {
        pubkey,
        kind: NDKKind.Metadata,
        content: JSON.stringify(profile),
        tags: [],
        created_at: unixNow(),
      };
      await publishEvent(metadata);
      // Relays
      const relayMetadata = {
        pubkey,
        kind: NDKKind.RelayList,
        content: "",
        tags: userRelays.map((r) => {
          return r.read && !r.write
            ? ["r", r.url, "read"]
            : r.write && !r.read
            ? ["r", r.url, "write"]
            : ["r", r.url];
        }),
        created_at: unixNow(),
      };
      const newRelays = await publishEvent(relayMetadata);
      setRelays(newRelays.rawEvent());
      // Contacts
      const contacts = {
        pubkey,
        kind: NDKKind.Contacts,
        content: "",
        tags: follows,
        created_at: unixNow(),
      };
      const newFollows = await publishEvent(contacts);
      setFollows(newFollows.rawEvent());
      toast.success(
        formatMessage({
          id: "ngine.onboarding.profile-created",
          description: "Profile created success message",
          defaultMessage: "Profile created",
        }),
      );
      onFinish();
    } catch (error) {
      console.error(error);
      toast.error(
        formatMessage({
          id: "ngine.onboarding.profile-created-error",
          description: "Profile created error message",
          defaultMessage: "Something went wrong",
        }),
      );
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <Stack gap={10} w="100%">
      <Stepper
        index={activeStep}
        colorScheme="brand"
        size={{ base: "xs", sm: "sm", md: "lg" }}
      >
        {steps.map((step, index) => (
          <Step key={index} onClick={() => setActiveStep(index + 1)}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle>{formatMessage(stepName[step])}</StepTitle>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
      <Stack gap={8} w="100%" justifyContent="center">
        {stepComponents[steps[activeStep - 1]]}
        <Stack>
          <Button
            isLoading={isBusy}
            variant="solid"
            colorScheme="brand"
            onClick={onNext}
          >
            {isLastStep ? (
              <FormattedMessage
                id="ngine.onboarding.finish"
                description="Onboarding finish button"
                defaultMessage="Finish"
              />
            ) : (
              <FormattedMessage
                id="ngine.onboarding.next"
                description="Onboarding next button"
                defaultMessage="Next"
              />
            )}
          </Button>
          {!isLastStep && (
            <Button
              isLoading={isBusy}
              variant="solid"
              colorScheme="gray"
              onClick={onNext}
            >
              <FormattedMessage
                id="ngine.onboarding.skip-step"
                description="Onboarding step skip button"
                defaultMessage="Skip for now"
              />
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
