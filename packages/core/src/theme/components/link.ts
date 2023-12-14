import { defineStyle, defineStyleConfig } from "@chakra-ui/react";
import { MultiStyleConfig } from "@chakra-ui/styled-system";

const brand = defineStyle({
  fontWeight: 500,
  color: "brand.500",
  _dark: {
    color: "brand.300",
  },

  _hover: {
    textDecoration: "none",
  },
});

export const linkTheme: MultiStyleConfig = defineStyleConfig({
  variants: { brand },
});
