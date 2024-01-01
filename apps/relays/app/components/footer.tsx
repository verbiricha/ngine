import { Stack, StackProps, Text } from "@chakra-ui/react";
import Link from "./link";

export default function Footer(props: StackProps) {
  return (
    <Stack
      align="center"
      justifyContent="center"
      as="footer"
      pt="8rem"
      pb="2rem"
      fontSize="xs"
      {...props}
    >
      <Text color="chakra-subtle-text">
        Relay data provided by
        <Link variant="brand" href="https://nostr.watch">
          nostr.watch
        </Link>
      </Text>
      <Text color="chakra-subtle-text">
        Powered by{" "}
        <Link variant="brand" href="https://github.com/verbiricha/ngine">
          ngine
        </Link>
      </Text>
    </Stack>
  );
}
