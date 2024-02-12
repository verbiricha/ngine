"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Flex,
  Box,
  Stack,
  HStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Image,
  Icon,
  Text,
  Button,
} from "@chakra-ui/react";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  unixNow,
  useSign,
  useSigner,
  Emoji,
  ImagePicker,
  AsyncButton,
} from "@ngine/core";

interface EmojiDefinition {
  shortcode: string;
  image: string;
}

interface NewEmojiProps {
  onNewEmoji(e: EmojiDefinition): void;
}

function NewEmoji({ onNewEmoji }: NewEmojiProps) {
  const [imageKey, setImageKey] = useState(Date.now());
  const [shortcode, setShortcode] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const isValidEmoji = shortcode.trim().length > 0 && image;

  function addEmoji() {
    if (image) {
      const emoji = { shortcode, image };
      onNewEmoji(emoji);
      setShortcode("");
      setImage(undefined);
      setImageKey(Date.now());
    }
  }

  return (
    <Stack gap={6}>
      <HStack align="center">
        <Image
          boxSize={6}
          src={image}
          fallback={
            <Icon
              color="chakra-subtle-text"
              boxSize={6}
              as={QuestionOutlineIcon}
            />
          }
        />
        <Input
          maxW="12em"
          value={shortcode}
          onChange={(ev) => setShortcode(ev.target.value)}
        />
        <Box flex={1}>
          <ImagePicker
            key={imageKey}
            showPreview={false}
            onImagePick={setImage}
          />
        </Box>
      </HStack>
      <Button isDisabled={!isValidEmoji} onClick={addEmoji}>
        Add
      </Button>
    </Stack>
  );
}

interface NewEmojiSetProps {
  defaultIdentifier?: string;
  defaultName?: string;
  defaultEmojis?: EmojiDefinition[];
}

export default function NewEmojiSet({
  defaultIdentifier,
  defaultName = "",
  defaultEmojis = [],
}: NewEmojiSetProps) {
  const router = useRouter();
  const sign = useSign();
  const canSign = useSigner();
  const [name, setName] = useState<string>(defaultName);
  const [emojis, setEmojis] = useState<EmojiDefinition[]>(defaultEmojis);
  const canSave = canSign && name.trim().length > 0;

  function addEmoji(e: EmojiDefinition) {
    setEmojis(emojis.concat([e]));
  }

  function removeEmoji(e: EmojiDefinition) {
    setEmojis(emojis.filter((emo) => emo.shortcode !== e.shortcode));
  }

  async function saveEmojiSet() {
    const newEmojiSet = {
      kind: NDKKind.EmojiSet,
      content: "",
      created_at: unixNow(),
      tags: [
        ["d", defaultIdentifier ? defaultIdentifier : name],
        ["title", name],
        ...emojis.map((e) => ["emoji", e.shortcode, e.image]),
      ],
    };
    try {
      const ev = await sign(newEmojiSet);
      if (ev) {
        await ev.publish();
        await router.push(`/a/${ev.encode()}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Stack>
      <HStack justify="space-between">
        {defaultIdentifier ? (
          <Heading>Edit emoji set</Heading>
        ) : (
          <Heading>New emoji set</Heading>
        )}
        <AsyncButton isDisabled={!canSave} onClick={saveEmojiSet}>
          Save
        </AsyncButton>
      </HStack>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Emoji set name"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
      </FormControl>
      <Heading fontSize="xl">Emojis</Heading>
      {emojis.length === 0 && (
        <Text color="chakra-subtle-text">No emojis yet</Text>
      )}
      <NewEmoji onNewEmoji={addEmoji} />
      <Heading>Preview</Heading>
      {emojis.map((e) => (
        <HStack key={e.shortcode} align="center" justifyContent="space-between">
          <HStack>
            <Emoji alt={e.shortcode} src={e.image} boxSize={12} />
            <Text>{e.shortcode}</Text>
          </HStack>
          <Button
            variant="outline"
            colorScheme="red"
            size="sm"
            onClick={() => removeEmoji(e)}
          >
            Remove
          </Button>
        </HStack>
      ))}
    </Stack>
  );
}
