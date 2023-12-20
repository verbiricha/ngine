import {
  useColorMode,
  useColorModeValue,
  Switch,
  HStack,
  Text,
  Icon,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

export default function ColorModeSwitch() {
  const lightColor = useColorModeValue("orange.500", "orange.200");
  const darkColor = useColorModeValue("gray.300", "gray.500");
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <HStack justify="space-between" w="100%">
      <Text>Theme</Text>

      <HStack>
        <Icon as={MoonIcon} boxsize={3} color={darkColor} />

        <Switch
          colorScheme="brand"
          onChange={toggleColorMode}
          isChecked={colorMode === "light"}
          size="sm"
        />

        <Icon as={SunIcon} boxsize={3} color={lightColor} />
      </HStack>
    </HStack>
  );
}
