import { extendTheme } from "@chakra-ui/react";
import { theme as baseTheme } from "@ngine/core";

import { buttonTheme } from "./theme/button";

import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

const fonts = {
  heading: `'Inter', sans-serif`,
  body: `'Inter', sans-serif`,
};

export const theme = extendTheme(
  {
    fonts,
    semanticTokens: {
      colors: {
        "chakra-body-bg": { _light: "white", _dark: "#111111" },
        "chakra-placeholder-color": {
          _light: "gray.500",
          _dark: "whiteAlpha.500",
        },
      },
    },
    components: {
      Button: buttonTheme,
    },
  },
  baseTheme,
);
