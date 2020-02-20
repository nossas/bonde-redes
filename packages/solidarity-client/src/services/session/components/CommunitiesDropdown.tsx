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
  communityId?: number;
  onChange: any;
}

const CommunitiesDropdown = ({ communities = [], communityId, onChange }: CommunitiesDropdownProps) => {
  const community = communities.filter(c => c.id === communityId)[0]

  return (
    <Dropdown label={() => <CommunityItem community={community} />}>
      {communities.map(c => (
        <DropdownItem key={`c-dropdown-${c.id}`} onClick={() => onChange(c)}>
          <CommunityItem community={c} />
        </DropdownItem>
      ))}
    </Dropdown>
  )
}

export default CommunitiesDropdown
