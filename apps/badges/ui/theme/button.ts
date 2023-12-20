import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const gradient = defineStyle({
  color: "white",
  borderRadius: "11000px",
  background: "linear-gradient(90deg, #B10BA5 0%, #CB5A7B 50%, #E29F56 100%)",
});

export const buttonTheme = defineStyleConfig({
  variants: { gradient },
});
