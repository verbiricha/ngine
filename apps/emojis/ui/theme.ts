import { extendTheme } from "@chakra-ui/react";
import { theme as baseTheme } from "@ngine/core";

export const theme = extendTheme(
  {
    semanticTokens: {
      colors: {
        "chakra-body-bg": { _light: "white", _dark: "#111111" },
        "chakra-placeholder-color": {
          _light: "gray.500",
          _dark: "whiteAlpha.500",
        },
      },
    },
  },
  baseTheme,
);
