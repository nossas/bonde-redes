import gql from 'graphql-tag'
import { client as GraphQLAPI } from '../../graphql'

const INDIVIDUALS_MUTATION = gql`
mutation insert_rede_individuals ($individuals: [rede_individuals_insert_input!]!) {
  insert_rede_individuals(
    objects: $individuals,
    on_conflict: {
      constraint: rede_individuals_form_entry_id,
      update_columns: [updated_at]
    }
  ) {
    returning {
      id
      first_name
      last_name
      email
      phone
      whatsapp
      
      extras
      
      zipcode
      address
      city
      state
      coordinates

      form_entry_id
      rede_group_id

      created_at
      updated_at
    }
  }
}
`

const insertRedeIndividuals = async (individuals: any): Promise<any> => {
	const { data: { insert_rede_individuals: { returning } } } = await GraphQLAPI.mutate({
		mutation: INDIVIDUALS_MUTATION,
    variables: { individuals }
	})

	return returning
}

export default insertRedeIndividuals
