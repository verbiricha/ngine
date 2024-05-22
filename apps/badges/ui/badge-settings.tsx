import { HStack } from "@chakra-ui/react";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { unixNow, tagValues, useSign, AsyncButton } from "@ngine/core";

interface BadgeSettingsProps {
  badge: NDKEvent;
  award: NDKEvent;
  profile?: NDKEvent;
  pubkey: string;
}

export default function BadgeSettings({
  badge,
  award,
  profile,
  pubkey,
}: BadgeSettingsProps) {
  const sign = useSign();
  const isWearing = profile
    ? tagValues(profile, "a").includes(badge.tagId())
    : false;

  async function wear() {
    const tags = profile
      ? profile.tags.concat([badge.tagReference(), award.tagReference()])
      : [["d", "profile_badges"], badge.tagReference(), award.tagReference()];
    const ev = {
      kind: NDKKind.ProfileBadge,
      content: "",
      created_at: unixNow(),
      tags,
    };
    try {
      const newProfile = await sign(ev);
      if (newProfile) {
        await newProfile.publish();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function remove() {
    const tags = profile
      ? profile.tags.filter((t) => {
          if (t[0] === "a") {
            return t[1] !== badge.tagId();
          }
          if (t[0] === "e") {
            return t[1] !== award.tagId();
          }
          return true;
        })
      : [["d", "profile_badges"]];
    const ev = {
      kind: NDKKind.ProfileBadge,
      content: "",
      created_at: unixNow(),
      tags,
    };
    try {
      const newProfile = await sign(ev);
      if (newProfile) {
        await newProfile.publish();
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <HStack w="100%" justify="space-between">
      <AsyncButton
        isDisabled={isWearing}
        colorScheme="brand"
        variant="outline"
        size="sm"
        onClick={wear}
      >
        Wear
      </AsyncButton>
      <AsyncButton
        isDisabled={!isWearing}
        colorScheme="red"
        variant="outline"
        size="sm"
        onClick={remove}
      >
        Remove
      </AsyncButton>
    </HStack>
  );
}
