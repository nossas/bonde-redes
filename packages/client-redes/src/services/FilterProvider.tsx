import React from "react";

export type Filters = {
  rows: number;
  offset: number;
  page: number;
  status: {
    _eq: string | undefined;
  };
  availability: {
    _eq: string | undefined;
  };
  order_by: {
    created_at: string;
  };
};

type Action =
  | { type: "page"; value: number }
  | { type: "rows"; value: number }
  | { type: "status"; value: string }
  | { type: "availability"; value: string };

type Dispatch = (action: Action) => void;

const FilterStateContext = React.createContext<Filters | undefined>(undefined);
const FilterDispatchContext = React.createContext<Dispatch | undefined>(
  undefined
);
function filterReducer(state, action) {
  switch (action.type) {
    case "page": {
      const valid =
        typeof action.value !== "undefined" ? action.value : state.page;
      return {
        ...state,
        page: valid,
        offset: valid * state.rows
      };
    }
    case "rows": {
      return {
        ...state,
        rows: action.value,
        offset: action.value * state.page
      };
    }
    case "status": {
      const valid = action.value === "all" ? undefined : action.value;
      return {
        ...state,
        status: { _eq: valid }
      };
    }
    case "availability": {
      const valid = action.value === "all" ? undefined : action.value;
      return {
        ...state,
        availability: { _eq: valid }
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const FilterProvider = ({ children }: { children: any }) => {
  const filtered = {
    rows: 1000,
    offset: 1000 * 0,
    page: 0,
    status: { _eq: undefined },
    availability: { _eq: undefined },
    order_by: { created_at: "asc" }
  };

  const [state, dispatch] = React.useReducer(filterReducer, filtered);

  return (
    <FilterStateContext.Provider value={state}>
      <FilterDispatchContext.Provider value={dispatch}>
        {children}
      </FilterDispatchContext.Provider>
    </FilterStateContext.Provider>
  );
};

function useFilterState() {
  const context = React.useContext(FilterStateContext);
  if (context === undefined) {
    throw new Error("useFilterState must be used within a FilterProvider");
  }
  return context;
}

function useFilterDispatch() {
  const context = React.useContext(FilterDispatchContext);
  if (context === undefined) {
    throw new Error("useFilterDispatch must be used within a FilterProvider");
  }
  return context;
}

const useFilter = (): [Filters, Dispatch] => [
  useFilterState(),
  useFilterDispatch()
];

export { FilterProvider, useFilterState, useFilterDispatch, useFilter };
