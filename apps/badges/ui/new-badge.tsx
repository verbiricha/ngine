import { useState, useMemo } from "react";
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
  Input,
  Textarea,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
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

import { rarityName, Rarities } from "@core/rarity";
import Badge from "./badge";

export default function NewBadge() {
  const router = useRouter();
  const ndk = useNDK();
  const canSign = useSigner();
  const sign = useSign();
  const session = useSession();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState();
  const [thumbnail, setThumbnail] = useState();

  const isValidBadge = name.trim().length > 0 && image;

  const badge = useMemo(() => {
    const d = slugify(name);
    // todo: rarity, id
    const ev = {
      pubkey: session?.pubkey || "",
      kind: NDKKind.BadgeDefinition,
      tags: [
        ["d", d],
        ["name", name],
        ...[description.trim().length > 0 ? ["description", description] : []],
        ...[image ? ["image", image] : []],
        ["alt", `Badge: ${name}`],
      ],
      content: "",
      created_at: unixNow(),
    };
    return ev;
  }, [session, name, description, image, thumbnail]);
  const preview = useMemo(() => {
    return new NDKEvent(ndk, badge);
  }, [badge]);

  async function createBadge() {
    try {
      const event = await sign(preview);
      if (event) {
        await event.publish();
        await router.push(`/a/${event.encode()}`);
      }
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
            placeholder="e.g. Nostr Early Adopter"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <FormHelperText>Tip: keep it short.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
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
            buttonProps={{ variant: "gradient" }}
            onImageUpload={setImage}
          />
          <FormHelperText>
            We recommend a WebP or a PNG of no less than 1024x1024 pixels.
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Thumbnail</FormLabel>
          <ImagePicker
            showPreview={false}
            buttonProps={{ variant: "gradient" }}
            onImageUpload={setThumbnail}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Rarity</FormLabel>
          <RadioGroup colorScheme="gray" defaultValue={Rarities.Normal}>
            <HStack wrap="wrap">
              <Radio value={Rarities.Normal}>
                {rarityName(Rarities.Normal)}
              </Radio>
              <Radio isDisabled value={Rarities.Rare}>
                {rarityName(Rarities.Rare)}
              </Radio>
              <Radio isDisabled value={Rarities.SuperRare}>
                {rarityName(Rarities.SuperRare)}
              </Radio>
              <Radio isDisabled value={Rarities.Epic}>
                {rarityName(Rarities.Epic)}
              </Radio>
              <Radio isDisabled value={Rarities.Legendary}>
                {rarityName(Rarities.Legendary)}
              </Radio>
            </HStack>
          </RadioGroup>
        </FormControl>
        <AsyncButton
          mt={4}
          onClick={createBadge}
          isDisabled={!isValidBadge || !canSign}
          variant="gradient"
        >
          Create
        </AsyncButton>
      </Stack>
      {session?.pubkey && (
        <Stack>
          <Heading>Preview</Heading>
          <Badge event={preview} />
        </Stack>
      )}
    </Flex>
  );
}
