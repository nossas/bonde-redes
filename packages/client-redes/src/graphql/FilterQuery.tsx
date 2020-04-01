import { useState } from "react";
/*import { useLocation } from 'react-router-dom'*/
/*import qs from 'query-string'*/

export type Filters = {
  rows: number;
  offset: number;
  status:
    | {
        _eq: string;
      }
    | undefined;
  availability:
    | {
        _eq: string;
      }
    | undefined;
  order_by: {
    created_at: string;
  };
};

const FilterQuery = ({ children }): JSX.Element => {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(1000);
  const [status, setStatus] = useState("");
  const [availability, setAvailability] = useState("");

  const filtered: Filters = {
    rows,
    offset: page * rows,
    status: !!status ? { _eq: status } : undefined,
    availability: !!availability ? { _eq: availability } : undefined,
    order_by: { created_at: "asc" }
  };

  const changeFilters = ({ page, rows, status, availability }): void => {
    if (typeof page !== "undefined") setPage(page);
    if (rows) setRows(rows);
    if (status) setStatus(status === "all" ? undefined : status);
    if (availability)
      setAvailability(availability === "all" ? undefined : availability);
  };

  return children({ filters: filtered, changeFilters, page });
};

export default FilterQuery;
