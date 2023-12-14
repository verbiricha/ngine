import { cardAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { MultiStyleConfig } from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

const event = definePartsStyle({
  container: {
    boxShadow: "md",
    width: "100%",
  },
  header: {
    paddingBottom: 0,
  },
  body: {
    paddingY: "20px",
    paddingX: "24px",
  },
  footer: {
    paddingTop: 0,
  },
});

export const cardTheme: MultiStyleConfig = defineMultiStyleConfig({
  variants: { event },
});
