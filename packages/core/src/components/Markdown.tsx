import { useMemo, useCallback, ReactNode } from "react";
import {
  Stack,
  StackProps,
  Box,
  Flex,
  Image,
  Heading,
  Text,
  LinkProps,
  OrderedList,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { nip19 } from "nostr-tools";

import Blockquote from "./Blockquote";
import NEvent from "./NEvent";
import NAddr from "./NAddr";
import Username from "./Username";
import { useLinks, useLinkComponent } from "../context";
import { Links, LinkComponent, Tags, Fragment, Components } from "../types";

// eslint-disable-next-line no-useless-escape
const FileExtensionRegex = /\.([\w]+)$/i;
const HashtagRegex = /(#[^\s!@#$%^&*()=+.\/,\[{\]};:'"?><]+)/g;

interface HyperTextProps extends LinkProps {
  link: string;
  children: ReactNode;
  Link: LinkComponent;
}

export function HyperText({ link, children, Link, ...rest }: HyperTextProps) {
  const render = useCallback(() => {
    try {
      const url = new URL(link);
      const extension =
        FileExtensionRegex.test(url.pathname.toLowerCase()) && RegExp.$1;
      if (extension) {
        switch (extension) {
          case "gif":
          case "jpg":
          case "jpeg":
          case "png":
          case "bmp":
          case "webp": {
            return (
              <Image
                src={url.toString()}
                alt={url.toString()}
                my={2}
                maxH="420px"
                width="100%"
                objectFit="contain"
              />
            );
          }
          case "wav":
          case "mp3":
          case "ogg": {
            return <audio key={url.toString()} src={url.toString()} controls />;
          }
          case "mp4":
          case "mov":
          case "mkv":
          case "avi":
          case "m4v":
          case "webm": {
            return <video key={url.toString()} src={url.toString()} controls />;
          }
          default:
            return (
              <Link variant="brand" {...rest} href={url.toString()}>
                {children || url.toString()}
              </Link>
            );
        }
      } else {
        return (
          <Link variant="brand" {...rest} href={link}>
            {children || link}
          </Link>
        );
      }
    } catch (error) {
      return (
        <Link variant="brand" {...rest} href={link}>
          {children || link}
        </Link>
      );
    }
  }, [link, children]);

  return render();
}

const NostrPrefixRegex = /^nostr:/;

function extractNprofiles(
  fragments: Fragment[],
  Link: LinkComponent,
  links?: Links,
): Fragment[] {
  return fragments
    .map((f) => {
      if (typeof f === "string") {
        return f.split(/(nostr:nprofile1[a-z0-9]+)/g).map((i) => {
          if (i.startsWith("nostr:nprofile1")) {
            try {
              const nprofile = i.replace(NostrPrefixRegex, "");
              const decoded = nip19.decode(nprofile);
              const url = links?.nprofile
                ? links.nprofile(nprofile)
                : links?.npub
                ? links.npub(nprofile)
                : `/${nprofile}`;
              if (decoded.type === "nprofile") {
                const { pubkey } = decoded.data;
                return (
                  <Link variant="brand" href={url}>
                    <Username as="span" pubkey={pubkey} />
                  </Link>
                );
              }
              return null;
            } catch (error) {
              return i;
            }
          } else {
            return i;
          }
        });
      }
      return f;
    })
    .flat();
}

function extractNpubs(
  fragments: Fragment[],
  Link: LinkComponent,
  links?: Links,
): Fragment[] {
  return fragments
    .map((f) => {
      if (typeof f === "string") {
        return f.split(/(nostr:npub1[a-z0-9]+)/g).map((i) => {
          if (i.startsWith("nostr:npub1")) {
            try {
              const raw = i.replace(NostrPrefixRegex, "");
              const decoded = nip19.decode(raw);
              if (decoded.type === "npub") {
                const url = links?.npub ? links.npub(raw) : `/${raw}`;
                return (
                  <Link variant="brand" href={url}>
                    <Username as="span" pubkey={decoded.data as string} />
                  </Link>
                );
              }
              return null;
            } catch (error) {
              return i;
            }
          } else {
            return i;
          }
        });
      }
      return f;
    })
    .flat();
}

function extractNevents(fragments: Fragment[], components: Components) {
  return fragments
    .map((f) => {
      if (typeof f === "string") {
        return f.split(/(nostr:nevent1[a-z0-9]+)/g).map((i) => {
          if (i.startsWith("nostr:nevent1")) {
            try {
              const nevent = i.replace(NostrPrefixRegex, "");
              const decoded = nip19.decode(nevent);
              if (decoded.type === "nevent") {
                const { id, relays } = decoded.data;
                return (
                  <Flex align="center" justify="center" my={2}>
                    <Box w={{ base: "sm", md: "lg" }}>
                      <NEvent
                        id={id}
                        relays={relays || []}
                        components={components}
                      />
                    </Box>
                  </Flex>
                );
              }
              return null;
            } catch (error) {
              return i;
            }
          } else {
            return i;
          }
        });
      }
      return f;
    })
    .flat();
}

function extractNoteIds(fragments: Fragment[], components: Components) {
  return fragments
    .map((f) => {
      if (typeof f === "string") {
        return f.split(/(nostr:note1[a-z0-9]+)/g).map((i) => {
          if (i.startsWith("nostr:note1")) {
            try {
              const decoded = nip19.decode(i.replace(NostrPrefixRegex, ""));
              if (decoded.type === "note") {
                return (
                  <Flex align="center" justify="center" my={2}>
                    <Box w={{ base: "sm", md: "lg" }}>
                      <NEvent
                        id={decoded.data}
                        relays={[]}
                        components={components}
                      />
                    </Box>
                  </Flex>
                );
              }
            } catch (error) {
              return i;
            }
          } else {
            return i;
          }
        });
      }
      return f;
    })
    .flat();
}

function extractNaddrs(fragments: Fragment[], components: Components) {
  return fragments
    .map((f) => {
      if (typeof f === "string") {
        return f.split(/(nostr:naddr1[a-z0-9]+)/g).map((i) => {
          if (i.startsWith("nostr:naddr1")) {
            try {
              const naddr = i.replace(NostrPrefixRegex, "");
              const decoded = nip19.decode(naddr);
              if (decoded.type === "naddr") {
                const { kind, pubkey, identifier, relays } = decoded.data;
                return (
                  <Flex align="center" justify="center" my={2}>
                    <Box w={{ base: "sm", md: "lg" }}>
                      <NAddr
                        kind={Number(kind)}
                        pubkey={pubkey}
                        identifier={identifier}
                        relays={relays || []}
                        components={components}
                      />
                    </Box>
                  </Flex>
                );
              }
            } catch (error) {
              return i;
            }
          } else {
            return i;
          }
        });
      }
      return f;
    })
    .flat();
}

function extractHashtags(
  fragments: Fragment[],
  Link: LinkComponent,
  links?: Links,
) {
  return fragments
    .map((f) => {
      if (typeof f === "string") {
        return f.split(HashtagRegex).map((i) => {
          if (i.toLowerCase().startsWith("#")) {
            const tag = i.slice(1);
            const url = links?.t ? links.t(tag) : null;
            return url ? (
              <Link variant="brand" href={url}>
                {i}
              </Link>
            ) : (
              i
            );
          } else {
            return i;
          }
        });
      }
      return f;
    })
    .flat();
}

function extractCustomEmoji(fragments: Fragment[], tags: Tags) {
  return fragments
    .map((f) => {
      if (typeof f === "string") {
        return f.split(/:(\w+):/g).map((i) => {
          const t = tags.find((a) => a[0] === "emoji" && a[1] === i);
          if (t) {
            return (
              <Image
                borderRadius="none"
                display="inline"
                fit="contain"
                src={t[2]}
                boxSize={5}
              />
            );
          } else {
            return i;
          }
        });
      }
      return f;
    })
    .flat();
}

function transformText(
  tags: Tags,
  fragments: Fragment[],
  components: Components,
  Link: LinkComponent,
  links?: Links,
): Fragment[] {
  let result = extractNprofiles(fragments, Link, links);
  result = extractNpubs(result, Link, links);
  result = extractNevents(result, components);
  result = extractNoteIds(result, components);
  result = extractHashtags(result, Link, links);
  result = extractNaddrs(result, components);
  result = extractCustomEmoji(result, tags);

  return result;
}

interface MarkdownProps extends StackProps {
  content: string;
  components?: Components;
  tags?: Tags;
}

export default function Markdown({
  content,
  components,
  tags = [],
  ...rest
}: MarkdownProps) {
  const Link = useLinkComponent();
  const links = useLinks();
  const markdownComponents = useMemo(() => {
    return {
      h1({ children }: { children: string }) {
        return <Heading as="h1">{children}</Heading>;
      },
      h2({ children }: { children: string }) {
        return <Heading as="h2">{children}</Heading>;
      },
      h3({ children }: { children: string }) {
        return <Heading as="h3">{children}</Heading>;
      },
      h4({ children }: { children: string }) {
        return <Heading as="h4">{children}</Heading>;
      },
      h5({ children }: { children: string }) {
        return <Heading as="h5">{children}</Heading>;
      },
      h6({ children }: { children: string }) {
        return <Heading as="h6">{children}</Heading>;
      },
      p({ children }: { children: string }) {
        return (
          <Text as="p" dir="auto">
            {transformText(
              tags,
              [children],
              components ?? ({} as Components),
              Link,
              links,
            )}
          </Text>
        );
      },
      ol({ children }: { children: ReactNode }) {
        return <OrderedList>{children}</OrderedList>;
      },
      ul({ children }: { children: ReactNode }) {
        return <UnorderedList>{children}</UnorderedList>;
      },
      li({ children }: { children: string }) {
        return (
          <ListItem>
            {transformText(
              tags,
              [children],
              components ?? ({} as Components),
              Link,
              links,
            )}
          </ListItem>
        );
      },
      blockquote({ children }: { children: string }) {
        return <Blockquote>{children}</Blockquote>;
      },
      a({ href, children, ...props }: { href: string; children: string }) {
        return (
          <HyperText link={href || ""} {...props} Link={Link} isExternal>
            {children}
          </HyperText>
        );
      },
    };
  }, []);
  return (
    <Stack dir="auto" wordBreak="break-word" {...rest}>
      <ReactMarkdown
        // @ts-ignore
        components={markdownComponents}
        skipHtml={true}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </Stack>
  );
}
