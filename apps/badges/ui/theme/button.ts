import { defineStyle, defineStyleConfig } from "@chakra-ui/react";
import type { StyleConfig } from "@chakra-ui/styled-system";

const gradient = defineStyle({
  color: "white",
  borderRadius: "11000px",
  background: "linear-gradient(90deg, #B10BA5 0%, #CB5A7B 50%, #E29F56 100%)",
});

// @ts-ignore
export const buttonTheme: StyleConfig = defineStyleConfig({
  variants: { gradient },
});
