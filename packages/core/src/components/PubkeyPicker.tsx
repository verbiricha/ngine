import { useState, useEffect } from "react";
import { Input, InputProps } from "@chakra-ui/react";
import { nip19, nip05 } from "nostr-tools";
import { useIntl } from "react-intl";

interface PubkeyPickerProps extends Omit<InputProps, "value" | "onChange"> {
  onPubkey(npub: string): void;
}

export default function PubkeyPicker({ onPubkey, ...rest }: PubkeyPickerProps) {
  const { formatMessage } = useIntl();
  const [npubLike, setNpubLike] = useState("");
  const [npub, setNpub] = useState<string | undefined>();

  async function onChangeNpub(maybeNpub: string) {
    setNpubLike(maybeNpub);

    if (maybeNpub === "") {
      setNpub();
      return;
    }

    try {
      if (maybeNpub.includes("@")) {
        const profile = await nip05.queryProfile(maybeNpub);
        if (profile) {
          setNpub(profile.pubkey);
        } else {
          setNpub();
        }
      } else if (
        maybeNpub.startsWith("npub") ||
        maybeNpub.startsWith("nprofile")
      ) {
        const decoded = nip19.decode(maybeNpub);
        if (decoded.type === "npub") {
          setNpub(decoded.data);
        } else if (decoded.type === "nprofile") {
          setNpub(decoded.data.pubkey);
        } else {
          setNpub();
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onPubkey(npub);
  }, [npub]);

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
