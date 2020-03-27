import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'
import { SessionHOC } from '../services/session'
import FilterQuery from './FilterQuery'

const USERS = gql`
query RedeGroups(
  $context: Int_comparison_exp!,
  $rows: Int!,
  $offset: Int!,
  $order_by: [rede_individuals_order_by!],
  $status: String_comparison_exp
  $availability: String_comparison_exp
  $is_volunteer: Boolean!
) {
  rede_individuals(
    where: {
      group: {
        community_id: $context,
        is_volunteer: { _eq: $is_volunteer }
      },
      status: $status,
      availability: $availability
      coordinates: { _is_null: false }
    },
      limit: $rows,
      offset: $offset,
      order_by: $order_by
  ) 
  {
    ...individual
  }
}

fragment individual on rede_individuals {
  id
  first_name
  last_name
  email
  whatsapp
  phone
  
  zipcode
  address
  city
  coordinates
  state
  
  status
  availability

  extras
  
  form_entry_id
  group {
  id
  community_id
  is_volunteer
  }
  
  created_at
  updated_at
}
`

export type Individual = {
  id: number
  first_name: string
  last_name: string
  email: string
  whatsapp: string
  phone: string
  zipcode: string
  address: string
  city: string
  coordinates: Object
  state: string
  status: string
  availability: string
  extras: Object
  form_entry_id: number
  group: {
    id: number
    community_id: number
    is_volunteer: boolean
  }
  created_at: string
  updated_at: string
}

type IndividualVars = {
  context: {
    _eq: number
  }
  filters: Object
  is_volunteer: boolean
}

interface IndividualData {
  rede_individuals: Individual[]
}

const FetchIndividuals = SessionHOC((props: any) => (
  <FilterQuery>
    {({ filters, changeFilters, page }) => {
      const { children, session: { community } } = props

      const variables = {
        ...(filters || {}),
        context: { _eq: community.id },
        is_volunteer: false, // TODO: deixar isso dinâmico!!
        availability: { _eq: "disponível" },
        status: { _eq: "aprovada" }
      }

      const { loading, error, data } = useQuery<IndividualData, IndividualVars>(USERS, { variables })

      if (loading) return <p>Loading...</p>

      if (error) {
        console.log('error', error)
        return <p>Error</p>
      }

      return children({
        data: data && data.rede_individuals,
        filters,
        page,
        changeFilters
      })
    }}
  </FilterQuery>
), { required: true })

export default FetchIndividuals