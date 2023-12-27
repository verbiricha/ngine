import { Stack, StackProps } from "@chakra-ui/react";
import { maxWidth } from "@ui/const";

export default function Main(props: StackProps) {
  return (
    <Stack
      spacing="1.5rem"
      width="100%"
      maxWidth={maxWidth}
      pt="2rem"
      px="1rem"
      {...props}
    />
  );
}
