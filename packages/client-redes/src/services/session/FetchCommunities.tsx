import React, { useState } from "react";
import { gql } from "apollo-boost";
import { FullPageLoading } from "bonde-styleguide";
import { useQuery } from "@apollo/react-hooks";

const FETCH_RELATED_COMMUNITIES = gql`
  query RelatedCommunities($userId: Int!) {
    communities(where: { community_users: { user_id: { _eq: $userId } } }) {
      id
      name
      city
      image
      created_at
      updated_at
    }
  }
`;

export interface Community {
  id: number;
  name: string;
  image: string;
  created_at: string;
  updated_at: string;
  city: string;
}

type FetchProps = {
  children: (any) => React.ReactChildren;
  variables: {
    userId: number;
  };
  defaultCommunity: string;
  onChange: (c: Community) => Promise<any>;
};

interface FetchRelatedCommunitiesData {
  communities: Community[];
}

interface FetchRelatedCommunitiesVars {
  userId: number;
}

export default ({
  children,
  variables,
  defaultCommunity,
  onChange
}: FetchProps) => {
  const [community, setCommunity] = useState(defaultCommunity);
  const { loading, error, data } = useQuery<
    FetchRelatedCommunitiesData,
    FetchRelatedCommunitiesVars
  >(FETCH_RELATED_COMMUNITIES, {
    variables
  });

  if (loading) return <FullPageLoading message="Carregando comunidades..." />;

  if (error || (data && !data.communities)) {
    console.log("error", { error, data });
    return children({ communities: [] });
  }

  const fetchCommunitiesProps = {
    communities: data && data.communities,
    community: Object.keys(community).length > 0 ? community : undefined,
    onChangeCommunity: c => {
      return onChange(c).then(() => setCommunity(c));
    }
  };

  return children(fetchCommunitiesProps);
};
