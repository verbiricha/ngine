import { useMemo } from "react";
import {
  Stack,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Link,
} from "@chakra-ui/react";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { useProfile, EventProps, Reactions } from "@ngine/core";

export default function App({ event }: EventProps) {
  const author = useProfile(event.pubkey);
  const app = useMemo(() => {
    try {
      return JSON.parse(event.content);
    } catch (e) {
      return author;
    }
  }, [event]);
  const href = app?.website;
  return (
    <Card>
      <CardBody>
        <Stack align="center">
          <Image src={app?.picture} boxSize={24} borderRadius="100%" />
          <Heading>{app?.display_name || app?.name}</Heading>
          {href && (
            <Link isExternal variant="brand" href={href}>
              {href}
            </Link>
          )}
        </Stack>
      </CardBody>
      <CardFooter>
        <Reactions event={event} kinds={[NDKKind.Reaction]} />
      </CardFooter>
    </Card>
  );
}
