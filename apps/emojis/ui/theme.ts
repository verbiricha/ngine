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
        brand: {
          50: "#e4fce4",
          100: "#bef1bf",
          200: "#97e697",
          300: "#6fdc6f",
          400: "#47d247",
          500: "#2db82d",
          600: "#218f22",
          700: "#156617",
          800: "#083e0b",
          900: "#001600",
        },
      },
    },
  },
  baseTheme,
);
