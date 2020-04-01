import { useState } from "react";

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

export const useFilterQuery = () => {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(100);
  const [status, setStatus] = useState("");
  const [availability, setAvailability] = useState("");

  const filtered: Filters = {
    rows,
    offset: page * rows,
    status: !!status ? { _eq: status } : undefined,
    availability: !!availability ? { _eq: availability } : undefined,
    order_by: { created_at: "desc" }
  };

  const changeFilters = ({ page, rows, status, availability }): void => {
    if (typeof page !== "undefined") setPage(page);
    if (rows) setRows(rows);
    if (status) setStatus(status === "all" ? undefined : status);
    if (availability)
      setAvailability(availability === "all" ? undefined : availability);
  };

  return { filters: filtered, changeFilters, page };
}
