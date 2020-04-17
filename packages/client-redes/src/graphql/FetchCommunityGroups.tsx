import React from "react";
import { gql } from "apollo-boost";
import { useSession, useQuery } from "bonde-core-tools";
import Empty from "../components/Empty";

const GROUPS = gql`
  query CommunityGroups($context: Int_comparison_exp!) {
    rede_groups(where: { community_id: $context }) {
      id
      community_id
      is_volunteer
      name
    }
  }
`;

const FetchCommunityGroups = (props: any) => {
  const { children, community } = props;

  const variables = { context: { _eq: community.id } };

  const { loading, error, data } = useQuery(GROUPS, { variables });

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log("error", error);
    return <p>Error</p>;
  }
  return children(data.rede_groups);
};

export default (props: any = {}) => {
  const { community } = useSession();
  return community ? (
    <FetchCommunityGroups community={community} {...props} />
  ) : (
    <Empty message="Selecione uma comunidade" />
  );
};
