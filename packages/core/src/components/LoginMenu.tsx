import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuListProps,
  MenuItem,
  MenuDivider,
  Icon,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { FormattedMessage } from "react-intl";

import Avatar from "./Avatar";
import { useLogOut } from "../context";
import { sessionAtom, followsAtom, relaysAtom } from "../state";
import { Close, ChevronDown } from "../icons";

export interface LoginMenuProps extends MenuListProps {}

export default function LoginMenu({ children }: LoginMenuProps) {
  const [session, setSession] = useAtom(sessionAtom);
  const [, setFollows] = useAtom(followsAtom);
  const [, setRelays] = useAtom(relaysAtom);
  const pubkey = session?.pubkey;
  const logOut = useLogOut();

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
