import { useState, useEffect } from "react";
import { Input, InputProps } from "@chakra-ui/react";
import { nip19, nip05 } from "nostr-tools";
import { useIntl } from "react-intl";

interface PubkeyPickerProps extends Omit<InputProps, "value" | "onChange"> {
  onPubkey(pk: string): void;
  cleanAfterAdding?: boolean;
}

export default function PubkeyPicker({
  onPubkey,
  cleanAfterAdding,
  ...rest
}: PubkeyPickerProps) {
  const { formatMessage } = useIntl();
  const [npubLike, setNpubLike] = useState("");
  const [pk, setPk] = useState<string | undefined>();

  async function onChangeNpub(maybeNpub: string) {
    setNpubLike(maybeNpub);

    if (maybeNpub === "") {
      setPk(undefined);
      return;
    }

    try {
      if (maybeNpub.includes("@")) {
        const profile = await nip05.queryProfile(maybeNpub);
        if (profile) {
          setPk(profile.pubkey);
        } else {
          setPk(undefined);
        }
      } else if (
        maybeNpub.startsWith("npub") ||
        maybeNpub.startsWith("nprofile")
      ) {
        const decoded = nip19.decode(maybeNpub);
        if (decoded.type === "npub") {
          setPk(decoded.data);
        } else if (decoded.type === "nprofile") {
          setPk(decoded.data.pubkey);
        } else {
          setPk(undefined);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (pk) {
      onPubkey(pk);
      if (cleanAfterAdding) {
        setNpubLike("");
      }
    }
  }, [pk]);

  return (
    <Input
      placeholder={formatMessage({
        id: "ngine.npub-placeholder",
        description: "Placeholder for pubkey picker field",
        defaultMessage: "npub, nprofile or nostr address...",
      })}
      value={npubLike}
      onChange={(ev) => onChangeNpub(ev.target.value)}
      {...rest}
    />
  );
}
