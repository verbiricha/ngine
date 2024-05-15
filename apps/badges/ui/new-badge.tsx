import { useRef, useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Flex,
  Stack,
  HStack,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Button,
  Input,
  Textarea,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { NostrEvent, NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import {
  useNDK,
  useSigner,
  useSign,
  useSession,
  unixNow,
  ImagePicker,
  AsyncButton,
} from "@ngine/core";
import slugify from "slugify";

import { rarityName, getMinPow, Rarities } from "@core/rarity";
import Badge from "./badge";

export default function NewBadge() {
  const router = useRouter();
  const ndk = useNDK();
  const canSign = useSigner();
  const sign = useSign();
  const session = useSession();
  const workerRef = useRef<Worker>();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const [thumbnail, setThumbnail] = useState<string | undefined>();
  const [minPow, setMinPow] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [badge, setBadge] = useState<NostrEvent | undefined>();

  const isValidBadge = name.trim().length > 0 && image;

  // PoW miner
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../core/worker.ts", import.meta.url),
    );
    workerRef.current.onmessage = (event: MessageEvent<number>) => {
      setBadge(event.data as unknown as NostrEvent);
      setIsMining(false);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    const slug = slugify(name);
    const d = slug.length > 0 ? slug : String(Date.now());
    const ev = {
      pubkey: session?.pubkey || "",
      kind: NDKKind.BadgeDefinition,
      tags: [
        ["d", d],
        ["name", name],
        ["alt", `Badge: ${name}`],
      ],
      content: "",
      created_at: unixNow(),
    };
    if (description.trim().length > 0) {
      ev.tags.push(["description", description]);
    }
    if (image) {
      ev.tags.push(["image", image]);
    }
    if (thumbnail) {
      ev.tags.push(["thumb", thumbnail]);
    }
    setBadge(ev);
  }, [session, name, description, image, thumbnail]);

  const preview = useMemo(() => {
    return new NDKEvent(ndk, badge);
  }, [badge]);

  function mine() {
    if (minPow > 0) {
      setIsMining(true);
      workerRef.current?.postMessage({
        event: badge,
        difficulty: minPow,
      });
    }
  }
  async function createBadge() {
    try {
      await preview.publish();
      await router.push(`/a/${preview.encode()}`);
    } catch (error) {}
  }

  return (
    <Flex
      gap={6}
      justify={{
        base: "center",
        md: "space-between",
      }}
      direction={{ base: "column", md: "row" }}
    >
      <Stack maxW="lg">
        <Heading>Create</Heading>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            isDisabled={isMining}
            placeholder="e.g. Nostr Early Adopter"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <FormHelperText>Tip: keep it short.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            isDisabled={isMining}
            placeholder="Your text..."
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
          />
          <FormHelperText>One or two sentences is good.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Image</FormLabel>
          <ImagePicker
            showPreview={false}
            buttonProps={{ variant: "outline", isDisabled: isMining }}
            inputProps={{ isDisabled: isMining }}
            onImagePick={setImage}
          />
          <FormHelperText>
            We recommend a WebP or a PNG of no less than 1024x1024 pixels.
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Thumbnail</FormLabel>
          <ImagePicker
            showPreview={false}
            buttonProps={{ variant: "outline", isDisabled: isMining }}
            inputProps={{ isDisabled: isMining }}
            onImagePick={setThumbnail}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Rarity</FormLabel>
          <HStack justify="space-between">
            <RadioGroup
              isDisabled={isMining}
              colorScheme="gray"
              value={String(minPow)}
              onChange={(value) => setMinPow(Number(value))}
            >
              <HStack gap={4} wrap="wrap">
                <Radio value={String(getMinPow(Rarities.Rare))}>
                  {rarityName(Rarities.Rare)}
                </Radio>
                <Radio value={String(getMinPow(Rarities.SuperRare))}>
                  {rarityName(Rarities.SuperRare)}
                </Radio>
                <Radio value={String(getMinPow(Rarities.Epic))}>
                  {rarityName(Rarities.Epic)}
                </Radio>
                <Radio value={String(getMinPow(Rarities.Legendary))}>
                  {rarityName(Rarities.Legendary)}
                </Radio>
              </HStack>
            </RadioGroup>
            <Button
              variant="outline"
              colorScheme="brand"
              isDisabled={!isValidBadge}
              isLoading={isMining}
              onClick={mine}
            >
              Mine
            </Button>
          </HStack>
          <FormHelperText>
            Badge creation takes more time the more rare it is. Make sure you
            don't change badge details after mining a rare badge.
          </FormHelperText>
        </FormControl>
        <AsyncButton
          mt={4}
          onClick={createBadge}
          isDisabled={!isValidBadge || !canSign || isMining}
          variant="outline"
        >
          Create
        </AsyncButton>
      </Stack>
      {session?.pubkey && badge && (
        <Stack>
          <Heading>Preview</Heading>
          <Badge event={preview} />
        </Stack>
      )}
    </Flex>
  );
}
