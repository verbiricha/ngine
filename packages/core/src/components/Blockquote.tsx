import { ReactNode } from "react";
import { Text } from "@chakra-ui/react";

export default function Blockquote({ children }: { children: ReactNode }) {
  return (
    <Text
      as="blockquote"
      sx={{
        paddingStart: 4,
        borderStartWidth: "4px",
        borderStartColor: "chakra-subtle-text",
      }}
    >
      {children}
    </Text>
  );
}
