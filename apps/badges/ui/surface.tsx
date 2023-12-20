import { useColorModeValue, Stack, StackProps } from "@chakra-ui/react";

export default function Surface({ children, ...props }: StackProps) {
  const bg = useColorModeValue("gray.50", "#1D1D1D");
  return (
    <Stack
      align="center"
      py={6}
      px={4}
      gap={4}
      bg={bg}
      borderRadius="24px"
      maxW="xs"
      wordBreak="break-word"
      {...props}
    >
      {children}
    </Stack>
  );
}
