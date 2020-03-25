import React from "react";
import { Dropdown, DropdownItem, Flexbox2 as Flexbox } from "bonde-styleguide";
import ImageColumn from "./ImageColumn";
import { Community } from "../FetchCommunities";

const CommunityItem = (props: {
  community: { image: string; name: string };
}) => (
  <Flexbox horizontal middle justify="end">
    <ImageColumn value={props.community.image} padding="" size={30} />
    <span style={{ marginLeft: "10px" }}>{props.community.name}</span>
  </Flexbox>
);

interface CommunitiesDropdownProps {
  communities: Community[];
  community: Community;
  onChange: (arg0: Community) => void;
}

const CommunitiesDropdown = ({
  communities = [],
  community,
  onChange
}: CommunitiesDropdownProps) => {
  const DropdownLabel = !!community
    ? () => <CommunityItem community={community} />
    : () => <span>Selecione uma comunidade</span>;

  return (
    <Dropdown label={DropdownLabel}>
      {communities.map((c: Community) => (
        <DropdownItem key={`c-dropdown-${c.id}`} onClick={() => onChange(c)}>
          <CommunityItem community={c} />
        </DropdownItem>
      ))}
    </Dropdown>
  );
};

export default CommunitiesDropdown;
