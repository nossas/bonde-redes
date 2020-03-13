import React from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownHeader,
  Flexbox2 as Flexbox,
  Icon,
  Text
} from "bonde-styleguide";
import { User } from "./PageLayout";

interface UserDropdownProps {
  user: User;
  logout: () => void;
}

const UserDropdown = ({ user, logout }: UserDropdownProps): JSX.Element => {
  const name = `${user.firstName} ${user.lastName}`;

  return (
    <Dropdown label={name}>
      <DropdownHeader>
        <img
          src={user.avatar || "http://via.placeholder.com/35x35?text=U"}
          alt={name}
          width="35"
          height="35"
        />
        <Flexbox vertical>
          <span>{name}</span>
          <Text fontSize={13} color="rgb(160, 157, 157)">
            {user.email}
          </Text>
        </Flexbox>
      </DropdownHeader>
      <DropdownItem onClick={logout}>
        <Icon name="times" />
        Sair
      </DropdownItem>
    </Dropdown>
  );
};

export default UserDropdown;
