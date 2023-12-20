"use client";

import { useState } from "react";
import {
  Flex,
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
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { Emoji, ImagePicker, AsyncButton } from "@ngine/core";

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
        <Input
          value={shortcode}
          onChange={(ev) => setShortcode(ev.target.value)}
        />
        <ImagePicker
          key={imageKey}
          showPreview={false}
          onImagePick={setImage}
        />

        <Flex>
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
        </Flex>
      </HStack>
      <Button isDisabled={!isValidEmoji} onClick={addEmoji}>
        Add
      </Button>
    </Stack>
  );
}

export default function NewEmojiSet() {
  const [name, setName] = useState<string>("");
  const [emojis, setEmojis] = useState<EmojiDefinition[]>([]);

  function addEmoji(e: EmojiDefinition) {
    setEmojis(emojis.concat([e]));
  }

  function removeEmoji(e: EmojiDefinition) {
    setEmojis(emojis.filter((emo) => emo.shortcode !== e.shortcode));
  }

  async function saveEmojiSet() {}

  return (
    <Stack>
      <HStack justify="space-between">
        <Heading>New emoji set</Heading>
        <AsyncButton onClick={saveEmojiSet}>Save</AsyncButton>
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
