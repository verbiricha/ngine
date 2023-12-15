import { useState, useMemo } from "react";
import { useAtom } from "jotai";
import { FormattedMessage } from "react-intl";
import { Button } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";

import { useNDK, useSigner } from "../context";
import { followsAtom, useSession } from "../state";
import { unixNow } from "../time";

interface FollowButtonProps extends ButtonProps {
  pubkey: string;
}

// todo: follow tags, communities, etc

export default function FollowButton({ pubkey, ...rest }: FollowButtonProps) {
  const ndk = useNDK();
  const canSign = useSigner();
  const [isBusy, setIsBusy] = useState(false);
  const session = useSession();
  const [contacts, setContacts] = useAtom(followsAtom);
  const loggedInUser = session?.pubkey;
  const isFollowed = useMemo(() => {
    return contacts?.tags.some((t) => t[0] === "p" && t[1] === pubkey);
  }, [contacts]);

  async function follow() {
    setIsBusy(true);
    const tags = (contacts?.tags || []).concat([["p", pubkey]]);
    const ev = {
      pubkey: loggedInUser as string,
      kind: NDKKind.Contacts,
      tags,
      created_at: unixNow(),
      content: "",
    };
    try {
      const signed = new NDKEvent(ndk, ev);
      await signed.sign();
      await signed.publish();
      setContacts(signed.rawEvent());
    } catch (error) {
      console.error(error);
    } finally {
      setIsBusy(false);
    }
  }

  async function unfollow() {
    setIsBusy(true);
    const tags = (contacts?.tags || []).filter((t) => t[1] !== pubkey);
    const ev = {
      pubkey: loggedInUser as string,
      kind: NDKKind.Contacts,
      tags,
      created_at: unixNow(),
      content: "",
    };
    try {
      const signed = new NDKEvent(ndk, ev);
      await signed.sign();
      await signed.publish();
      setContacts(signed.rawEvent());
    } catch (error) {
      console.error(error);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <Button
      isDisabled={!pubkey || !contacts || !canSign}
      isLoading={isBusy}
      variant="solid"
      onClick={isFollowed ? unfollow : follow}
      colorScheme={isFollowed ? "red" : "brand"}
      {...rest}
    >
      {isFollowed ? (
        <FormattedMessage
          id="ngine.unfollow"
          description="Unfollow a user"
          defaultMessage="Unfollow"
        />
      ) : (
        <FormattedMessage
          id="ngine.follow"
          description="Follow a user"
          defaultMessage="Follow"
        />
      )}
    </Button>
  );
}
