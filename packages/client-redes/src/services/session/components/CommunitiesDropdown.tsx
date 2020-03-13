import React from "react";
import { Dropdown, DropdownItem, Flexbox2 as Flexbox } from "bonde-styleguide";
import ImageColumn from "./ImageColumn";
import { Community } from "./PageLayout";

const CommunityItem = (
  props: { community: { image: string; name: string } } = {
    community: { image: "", name: "" }
  }
): JSX.Element => (
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
}: CommunitiesDropdownProps): JSX.Element => {
  const DropdownLabel = !!community
    ? (): JSX.Element => <CommunityItem community={community} />
    : (): React.ReactNode => <span>Selecione uma comunidade</span>;

  return (
    <Dropdown label={DropdownLabel}>
      {communities.map(
        (c: Community): React.ReactNode => (
          <DropdownItem
            key={`c-dropdown-${c.id}`}
            onClick={(): void => onChange(c)}
          >
            <CommunityItem community={c} />
          </DropdownItem>
        )
      )}
    </Dropdown>
  );
};

export default CommunitiesDropdown;
