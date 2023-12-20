import { Flex, FlexProps } from "@chakra-ui/react";

export default function Container(props: FlexProps) {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      transition="all 0.15s ease-out"
      {...props}
    />
  );
}
