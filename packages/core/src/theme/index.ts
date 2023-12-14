import { extendTheme } from "@chakra-ui/react";

import { linkTheme } from "./components/link";
import { cardTheme } from "./components/card";

export const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: "#FAF6FF",
      100: "#E8DAFF",
      200: "#B1A4E9",
      300: "#8B7BE7",
      400: "#6652E5",
      500: "#6941C6",
      600: "#5E32BA",
      700: "#5730B1",
      800: "#512FAB",
      900: "#4F1AA5",
    },
  },
  components: {
    Card: cardTheme,
    Link: linkTheme,
  },
});
