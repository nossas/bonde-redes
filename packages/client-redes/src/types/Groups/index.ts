import { Individual } from "../Individual";
import { Filters } from "../../services/FilterProvider";

export interface GroupsData {
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

export type Group = {
  is_volunteer: boolean;
  name: string;
};

export interface GroupsData {
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
  community_groups: Group[];
}

export interface GroupsVars {
  context: {
    _eq: number;
  };
  filters?: Filters;
}
