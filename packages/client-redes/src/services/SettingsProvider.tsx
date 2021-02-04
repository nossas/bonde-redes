import React from "react";
import { useSession, useQuery } from "bonde-core-tools";
import { SettingsData, SettingsVars, Settings } from "../types";
import { gql } from "apollo-boost";

const SettingsContext = React.createContext<Settings | undefined>(undefined);

const SETTINGS = gql`
  query fetchModuleSettings($communityId: bigint!) {
    community_settings(where: { community_id: { _eq: $communityId } }) {
      id
      settings
      name
      version
      community_id
    }
  }
`;

const SettingsProvider = ({ children }: { children: any }) => {
  const { community } = useSession();
  const variables = { communityId: (community && community.id) || 0 };

  const { loading, error, data } = useQuery<SettingsData, SettingsVars>(
    SETTINGS,
    { variables }
  );

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log("error", error);
    return <p>Error</p>;
  }

  const initialValue = {
    settings: {
      distance: 0,
      volunteer_msg: "",
      individual_msg: ""
    }
  };

  const value =
    (data && data.community_settings && data.community_settings[0]) ||
    initialValue;

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

const useSettings = () => {
  const context = React.useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export { SettingsProvider, useSettings };