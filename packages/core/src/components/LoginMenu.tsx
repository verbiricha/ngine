import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuListProps,
  MenuItem,
  Icon,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { FormattedMessage } from "react-intl";

import Avatar from "./Avatar";
import { sessionAtom } from "../state";
import { Close, ChevronDown } from "../icons";

interface LoginMenuProps extends MenuListProps {}

export default function LoginMenu({ children }: LoginMenuProps) {
  const [session, setSession] = useAtom(sessionAtom);
  const pubkey = session?.pubkey;

  function logOut() {
    setSession(null);
  }

  return pubkey ? (
    <Menu>
      <MenuButton
        variant="solid"
        size="sm"
        as={Button}
        rightIcon={<Icon as={ChevronDown} />}
      >
        <Avatar pubkey={pubkey} size="xs" />
      </MenuButton>
      <MenuList>
        {children}
        <MenuItem icon={<Icon as={Close} />} onClick={logOut}>
          <FormattedMessage
            id="ngine.log-out"
            description="Log out button"
            defaultMessage="Log out"
          />
        </MenuItem>
      </MenuList>
    </Menu>
  ) : null;
}
