import React from "react";
import { gql } from "apollo-boost";
import { useSession, useQuery } from 'bonde-core-tools';
import { useFilterQuery } from "./FilterQuery";
import Empty from '../components/Empty';
import { IndividualData, IndividualVars } from '../types/Individual'

const USERS = gql`
  query RedeIndividuals(
    $context: Int_comparison_exp!
    $rows: Int!
    $offset: Int!
    $order_by: [rede_individuals_order_by!]
    $status: String_comparison_exp
    $availability: String_comparison_exp
    $is_volunteer: Boolean!
  ) {
    rede_individuals(
      where: {
        group: { community_id: $context, is_volunteer: { _eq: $is_volunteer } }
        _and: [{ status: $status }, { availability: $availability }]
        coordinates: { _is_null: false }
      }
      limit: $rows
      offset: $offset
      order_by: $order_by
    ) {
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
`;

const FetchIndividuals = ({ children, community }: any) => {
  const { filters, changeFilters, page } = useFilterQuery();
  const variables = {
    context: { _eq: community.id },
    ...(filters || {}),
    is_volunteer: false, // TODO: deixar isso dinâmico!!
    availability: { _eq: "disponível" },
    status: { _eq: "aprovada" }
  };

  const {
    loading,
    // error,
    data
  } = useQuery<IndividualData, IndividualVars>(USERS, { variables });

  if (loading) return <p>Loading...</p>;

  return children({
    data: data && data.rede_individuals,
    filters,
    page,
    changeFilters
  });
};

export default (props: any = {}) => {
  const { community } = useSession();
  return community
    ? <FetchIndividuals community={community} {...props}/>
    : <Empty message='Selecione uma comunidade' />
  ;
};