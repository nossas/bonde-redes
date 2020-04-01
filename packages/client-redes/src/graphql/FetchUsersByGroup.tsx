import React from 'react';
import { gql } from 'apollo-boost';
import { useSession, useQuery } from 'bonde-core-tools';
import Empty from '../components/Empty';
import { Filters, useFilterQuery } from './FilterQuery';
import { Individual } from "./FetchIndividuals";

const USERS_BY_GROUP = gql`
  query RedeGroups(
    $context: Int_comparison_exp!
    $rows: Int!
    $offset: Int!
    $order_by: [rede_individuals_order_by!]
    $status: String_comparison_exp
    $availability: String_comparison_exp
  ) {
    volunteers: rede_individuals(
      where: {
        group: { community_id: $context, is_volunteer: { _eq: true } }
        status: $status
        availability: $availability
      }
      limit: $rows
      offset: $offset
      order_by: $order_by
    ) {
      ...individual
    }
    volunteers_count: rede_individuals_aggregate(
      where: { group: { community_id: $context, is_volunteer: { _eq: true } } }
    ) {
      aggregate {
        count
      }
    }
    individuals: rede_individuals(
      where: {
        group: { community_id: $context, is_volunteer: { _eq: false } }
        status: $status
        availability: $availability
      }
      limit: $rows
      offset: $offset
      order_by: $order_by
    ) {
      ...individual
    }
    individuals_count: rede_individuals_aggregate(
      where: { group: { community_id: $context, is_volunteer: { _eq: false } } }
    ) {
      aggregate {
        count
      }
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

interface GroupsData {
  individuals: Individual[];
  individuals_count: {
    aggregate: {
      count: number;
    };
  };
  volunteers: Individual[];
  volunteers_count: {
    aggregate: {
      count: number;
    };
  };
}

interface GroupsData {
  individuals: Individual[];
  individuals_count: {
    aggregate: {
      count: number;
    };
  };
  volunteers: Individual[];
  volunteers_count: {
    aggregate: {
      count: number;
    };
  };
}

interface GroupsVars {
  context: {
    _eq: number;
  };
  filters: Filters;
}

const FetchUsersByGroup = ({ children, community }) => {
  const { filters, changeFilters, page } = useFilterQuery();

  const variables = {
    context: { _eq: community.id },
    ...(filters || {})
  };

  const { loading, error, data } = useQuery<GroupsData, GroupsVars>(
    USERS_BY_GROUP,
    { variables }
  );

  if (error) {
    console.log("error", error);
    return <p>Error</p>;
  }
  if (loading) return <p>Loading...</p>;

  return (
    data &&
    children({
      volunteers: {
        data: data.volunteers,
        count: data.volunteers_count.aggregate.count
      },
      individuals: {
        data: data.individuals,
        count: data.individuals_count.aggregate.count
      },
      filters,
      page,
      changeFilters
    })
  );
};

export default (props) => {
  const { community } = useSession();

  return community
    ? <FetchUsersByGroup community={community} {...props} />
    : <Empty message='Selecione uma comunidade' />
  ;
};
