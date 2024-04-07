import { useState } from "react";
import { Stack, Heading, HStack, Button, Textarea } from "@chakra-ui/react";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { unixNow, useSign, User, AsyncButton, PubkeyPicker } from "@ngine/core";

interface BatchPubkeyPickerProps {
  addPubkeys: (pks: string[]) => void;
}

function BatchPubkeyPicker({ addPubkeys }: BatchPubkeyPickerProps) {
  const [pubkeys, setPubkeys] = useState("");

  function onChange(raw: string) {
    const pks = raw.split(/\s/).filter((s) => s.length === 64);
    console.log("PKS", pks);
    addPubkeys(pks);
    setPubkeys("");
  }

  return (
    <Textarea
      placeholder="Batch of hex pubkeys"
      value={pubkeys}
      onChange={(ev) => onChange(ev.target.value)}
    />
  );
}

export default function AwardBadge({ event }: { event: NDKEvent }) {
  const sign = useSign();
  const [pubkeys, setPubkeys] = useState<string[]>([]);

  function addPubkey(pk: string) {
    if (!pubkeys.includes(pk)) {
      setPubkeys(pubkeys.concat([pk]));
    }
  }

  function addPubkeys(pks: string[]) {
    setPubkeys(Array.from(new Set(pubkeys.concat(pks))));
  }

  function removePubkey(pk: string) {
    setPubkeys(pubkeys.filter((p) => p !== pk));
  }

  async function awardBadge() {
    const ev = {
      kind: NDKKind.BadgeAward,
      content: "",
      created_at: unixNow(),
      tags: [event.tagReference(), ...pubkeys.map((p) => ["p", p])],
    };
    console.log("EV", ev);
    try {
      const award = await sign(ev);
      if (award) {
        await award.publish();
        setPubkeys([]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Stack mt={2} gap={3}>
      <Heading fontSize="xl">Award</Heading>
      <PubkeyPicker onPubkey={addPubkey} cleanAfterAdding />
      <BatchPubkeyPicker addPubkeys={addPubkeys} />
      <AsyncButton
        variant="outline"
        colorScheme="brand"
        isDisabled={pubkeys.length === 0}
        onClick={awardBadge}
      >
        Award
      </AsyncButton>
      <Stack gap={4}>
        {pubkeys.map((pk) => (
          <HStack align="center" justify="space-between" key={pk}>
            <User pubkey={pk} />
            <Button
              variant="outline"
              colorScheme="red"
              onClick={() => removePubkey(pk)}
              size="xs"
            >
              Remove
            </Button>
          </HStack>
        ))}
      </Stack>
    </Stack>
  );
}
