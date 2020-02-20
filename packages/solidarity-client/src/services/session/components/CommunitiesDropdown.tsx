import React from 'react'
import { Dropdown, DropdownItem, Flexbox2 as Flexbox } from 'bonde-styleguide'
import ImageColumn from './ImageColumn'

const CommunityItem = (props: any = {}) => (
  <Flexbox horizontal middle justify='end'>
    <ImageColumn
      value={props.community.image}
      padding=''
      size={30}
    />
    <span style={{ marginLeft: '10px' }}>{props.community.name}</span>
  </Flexbox>
)

interface Community {
  id: number;
  name: string;
}

interface CommunitiesDropdownProps {
  communities?: Community[];
  community?: Community;
  onChange: any;
}

const CommunitiesDropdown = ({ communities = [], community, onChange }: CommunitiesDropdownProps) => {
  const DropdownLabel = !!community
    ? () => <CommunityItem community={community} />
    : () => <span>Selecione uma comunidade</span>

  return (
    <Dropdown label={DropdownLabel}>
      {communities.map(c => (
        <DropdownItem key={`c-dropdown-${c.id}`} onClick={() => onChange(c)}>
          <CommunityItem community={c} />
        </DropdownItem>
      ))}
    </Dropdown>
  )
}

export default CommunitiesDropdown
