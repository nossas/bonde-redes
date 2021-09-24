import { gql } from "@apollo/client";
import { client as GraphQLAPI } from "../../graphql";

const MAPA_DO_ACOLHIMENTO_COMMUNITY = 40;

const FETCH_REDES_QUERY = gql`
  query redes {
    rede_groups(where: {community_id: {_neq: ${MAPA_DO_ACOLHIMENTO_COMMUNITY}}}) {
      id
      name
      is_volunteer
      metadata
      widget_id
      community_id
      created_at
      updated_at
    }
  }
`;

const fetchRedesGroups = async (): Promise<any> => {
  try {
    const { data: { rede_groups: groups } } = await GraphQLAPI.query({
      query: FETCH_REDES_QUERY,
      fetchPolicy: 'network-only'
    })
  
    return groups
  } catch (err) {
		console.error('failed on fetch redes groups: '.red, err)
		return undefined
	}
}

export default fetchRedesGroups;
