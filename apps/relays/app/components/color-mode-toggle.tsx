"use client";

import { useColorMode, Icon, IconButton } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useIntl } from "react-intl";

export default function ColorModeToggle() {
  const { formatMessage } = useIntl();
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <IconButton
      size="sm"
      icon={
        isDark ? (
          <Icon as={SunIcon} boxSize={4} />
        ) : (
          <Icon as={MoonIcon} boxSize={4} />
        )
      }
      aria-label={formatMessage({
        id: "toggle-theme",
        description: "Theme toggle label text",
        defaultMessage: "Toggle Theme",
      })}
      onClick={toggleColorMode}
    />
  );
}
