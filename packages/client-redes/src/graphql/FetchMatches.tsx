import React from "react";
import { gql } from "apollo-boost";
import { useSession, useQuery } from "bonde-core-tools";
import Empty from "../components/Empty";

const MATCHES = gql`
  query RedeRelationships($context: Int_comparison_exp!) {
    rede_relationships(
      where: { recipient: { group: { community_id: $context } } }
    ) {
      status
      is_archived
      comments
      metadata
      updated_at
      created_at
      recipient {
        id
        first_name
      }
      volunteer {
        id
        first_name
      }
      agent {
        id
        first_name
      }
      id
    }
  }
`;

const FetchMatches = (props: any) => {
  const { children, community } = props;

  const variables = { context: { _eq: community.id } };

  const { loading, error, data } = useQuery(MATCHES, { variables });

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log("error", error);
    return <p>Error</p>;
  }
  return children(data.rede_relationships);
};

export default (props: any = {}) => {
  const { community } = useSession();
  return community ? (
    <FetchMatches community={community} {...props} />
  ) : (
    <Empty message="Selecione uma comunidade" />
  );
};
