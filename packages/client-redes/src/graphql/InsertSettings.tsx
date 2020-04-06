import { gql } from "apollo-boost";

export default gql`
  mutation updateSettings(
    $communityId: bigint
    $settings: json
  ) {
    update_app_settings(
      _set: {
        settings: $settings
      }
      where: {
        id: { _eq: $communityId }
      }
    ) {
      returning {
        id
        settings
      }
    }
`;
