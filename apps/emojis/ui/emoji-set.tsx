import { useRouter } from "next/navigation";
import {
  Flex,
  Stack,
  HStack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import {
  LinkIcon,
  EditIcon,
  StarIcon,
  DeleteIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import {
  unixNow,
  useLatestEvent,
  useSession,
  useSign,
  useSigner,
  EventProps,
  User,
  Reactions,
  Emoji,
} from "@ngine/core";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { FormattedMessage } from "react-intl";

// todo: if author: edit
// todo: add to favorites emojis

export default function EmojiSet({ event }: EventProps) {
  const router = useRouter();
  const title = event.tagValue("title") || event.tagValue("d");
  const canSign = useSigner();
  const sign = useSign();
  const emojis = event.tags.filter((t) => t[0] === "emoji");
  const session = useSession();
  const isMine = session?.pubkey === event.pubkey;
  const emojiList = useLatestEvent(
    {
      kinds: [NDKKind.EmojiList],
      authors: [session?.pubkey || ""],
    },
    {
      disable: !session?.pubkey,
    },
  );

  const isBookmarked = emojiList?.tags.find(
    (t) => t[0] === "a" && t[1] === event.tagId(),
  );

  async function addBookmark() {
    const newBookmarks = {
      kind: NDKKind.EmojiList,
      created_at: unixNow(),
      content: emojiList?.content || "",
      tags: (emojiList?.tags || []).concat([event.tagReference()]),
    };
    try {
      const ev = await sign(newBookmarks);
      if (ev) {
        await ev.publish();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function removeBookmark() {
    const newBookmarks = {
      kind: NDKKind.EmojiList,
      created_at: unixNow(),
      content: emojiList?.content || "",
      tags: (emojiList?.tags || []).filter(
        (t) => t[0] === "a" && t[1] !== event.tagId(),
      ),
    };
    try {
      const ev = await sign(newBookmarks);
      if (ev) {
        await ev.publish();
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Card variant="event">
      <CardHeader>
        <HStack align="flex-start" justify="space-between">
          <Stack>
            <Heading fontSize="2xl">{title}</Heading>
            <User size="xs" fontSize="sm" pubkey={event.pubkey} />
          </Stack>
          <Menu isLazy>
            <MenuButton
              as={Button}
              size="xs"
              variant="outline"
              colorScheme="brand"
              isDisabled={!canSign}
              rightIcon={<Icon as={ChevronDownIcon} />}
            >
              Options
            </MenuButton>
            <MenuList>
              <MenuItem
                icon={<Icon as={LinkIcon} />}
                onClick={() => router.push(`/a/${event.encode()}`)}
              >
                Open
              </MenuItem>
              {isBookmarked ? (
                <MenuItem
                  icon={<Icon as={DeleteIcon} />}
                  onClick={removeBookmark}
                >
                  Unbookmark
                </MenuItem>
              ) : (
                <MenuItem icon={<Icon as={StarIcon} />} onClick={addBookmark}>
                  Bookmark
                </MenuItem>
              )}
              {isMine && (
                <MenuItem
                  icon={<Icon as={EditIcon} />}
                  onClick={() => router.push(`/a/${event.encode()}/edit`)}
                >
                  Edit
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </HStack>
      </CardHeader>
      <CardBody>
        <Flex gap={4} wrap="wrap">
          {emojis.map((e) => (
            <Emoji key={e[1]} alt={e[1]} src={e[2]} boxSize={8} />
          ))}
        </Flex>
      </CardBody>
      <CardFooter>
        <Reactions
          kinds={[
            NDKKind.Zap,
            NDKKind.Reaction,
            //NDKKind.EmojiList,
          ]}
          event={event}
          //bookmarkList={NDKKind.EmojiList}
          components={{
            [NDKKind.EmojiSet]: EmojiSet,
          }}
        />
      </CardFooter>
    </Card>
  );
}
