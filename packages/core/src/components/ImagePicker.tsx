import { useMemo, useState, useRef, type ChangeEvent } from "react";
import { VoidApi } from "@void-cat/api";
import { base64 } from "@scure/base";
import { NDKPrivateKeySigner, NDKKind } from "@nostr-dev-kit/ndk";
import { Stack, HStack, Button, Input, Avatar } from "@chakra-ui/react";
import { useIntl, FormattedMessage } from "react-intl";
import { generatePrivateKey } from "nostr-tools";

import { useSign } from "../context";
import { unixNow } from "../time";
import useFeedback from "../hooks/useFeedback";

const FILE_EXT_REGEX = /\.([\w]{1,7})$/i;
const VOID_CAT_HOST = "https://void.cat";

type UploadResult = {
  url?: string;
  error?: string;
};

interface ImagePickerProps {
  showPreview?: boolean;
  onImageUpload: (img: string) => void;
  defaultImage?: string;
}

export default function ImagePicker({
  showPreview = true,
  onImageUpload,
  defaultImage,
}: ImagePickerProps) {
  const { formatMessage } = useIntl();
  // todo: use NDK signer if available?
  const signer = useMemo(
    () => new NDKPrivateKeySigner(generatePrivateKey()),
    [],
  );
  const sign = useSign();
  const ref = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<string | undefined>(defaultImage);
  const [isUploading, setIsUploading] = useState(false);
  const toast = useFeedback();

  async function auth(url: string, method: string) {
    const e = {
      kind: 27235 as NDKKind,
      created_at: unixNow(),
      content: "",
      tags: [
        ["u", url],
        ["method", method],
      ],
    };
    const signed = await sign(e, signer);
    if (signed) {
      const authEvent = signed.rawEvent();
      const token = base64.encode(
        new TextEncoder().encode(JSON.stringify(authEvent)),
      );
      return `Nostr: ${token}`;
    }

    return ``;
  }

  async function onFileChange(ev: ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files && ev.target.files[0];
    if (file) {
      try {
        setIsUploading(true);
        const upload = await voidCatUpload(file);
        if (upload.url) {
          setImage(upload.url);
          onImageUpload(upload.url);
          toast.success("File uploaded");
        }
        if (upload.error) {
          toast.error(upload.error);
        }
      } catch (error) {
        console.error(error);
        toast.error("Couldn't upload file");
      } finally {
        setIsUploading(false);
      }
    }
  }

  async function voidCatUpload(file: File): Promise<UploadResult> {
    const voidCatApi = new VoidApi(VOID_CAT_HOST, auth);
    const uploader = voidCatApi.getUploader(file);

    const rsp = await uploader.upload({
      "V-Strip-Metadata": "true",
    });
    if (rsp.ok) {
      let ext = file.name.match(FILE_EXT_REGEX);
      if (rsp.file?.metadata?.mimeType === "image/webp") {
        ext = ["", "webp"];
      }
      const resultUrl =
        rsp.file?.metadata?.url ??
        `${VOID_CAT_HOST}/d/${rsp.file?.id}${ext ? `.${ext[1]}` : ""}`;

      const ret = {
        url: resultUrl,
      } as UploadResult;

      return ret;
    } else {
      return {
        error: rsp.errorMessage,
      };
    }
  }

  return (
    <Stack align="center" gap={4}>
      {showPreview && <Avatar key={image} size="xl" src={image} />}
      <HStack w="100%">
        <Input
          value={image}
          placeholder={formatMessage({
            id: "ngine.upload-url",
            description: "Placeholder for image upload URL field",
            defaultMessage: "Image URL",
          })}
          onChange={(ev) => setImage(ev.target.value)}
        />
        <Button
          colorScheme="brand"
          isDisabled={isUploading}
          onClick={() => ref.current?.click()}
        >
          <FormattedMessage
            id="ngine.upload"
            description="Upload button"
            defaultMessage="Upload"
          />
        </Button>
        <Input ref={ref} type="file" onChange={onFileChange} display="none" />
      </HStack>
    </Stack>
  );
}
