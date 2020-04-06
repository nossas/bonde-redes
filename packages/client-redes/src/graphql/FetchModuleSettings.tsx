import React from 'react'
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { SessionHOC } from "../services/session";
import { SettingsData, SettingsVars } from "../types"

const SETTINGS = gql`
  query fetchModuleSettings(
    $communityId: bigint!
  ) {
    app_settings(
      where: {
        community_id: { _eq: $communityId }
      }
    ) {
      id
      settings
      name
      version
    }
  }
`;

const FetchSettings = SessionHOC(
  (props: { children; session: { community: { id: number } } }) => {
    const {
      children,
      session: { community }
    } = props;

    const variables = { communityId: community.id };

    const { loading, error, data } = useQuery<
      SettingsData,
      SettingsVars
    >(SETTINGS, { variables });

    if (loading) return <p>Loading...</p>;
    if (error) {
      console.log("error", error);
      return <p>Error</p>;
    }

    return children(data && data.app_settings);
  },
  { required: true }
);

export default FetchSettings;