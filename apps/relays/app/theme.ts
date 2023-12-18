import { extendTheme } from "@chakra-ui/react";
import { theme as baseTheme } from "@ngine/core";

export const theme = extendTheme(
  {
    semanticTokens: {
      colors: {
        "chakra-body-bg": { _light: "#F8F7F4", _dark: "#111111" },
        "chakra-placeholder-color": {
          _light: "gray.500",
          _dark: "whiteAlpha.500",
        },
      },
    },
    colors: {
      brand: {
        50: "#ffe8df",
        100: "#ffc0b1",
        200: "#fe9881",
        300: "#fc6f50",
        400: "#fa471f",
        500: "#e02d05",
        600: "#af2203",
        700: "#7d1701",
        800: "#4e0b00",
        900: "#200100",
      },
    },
  },
  baseTheme,
);
