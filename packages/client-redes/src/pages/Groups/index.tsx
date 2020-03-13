import React, { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  Page,
  Flexbox2 as Flexbox,
  Spacing,
  Dropdown,
  DropdownItem
} from "bonde-styleguide";
import ReactTable from "react-table";
import { useStoreActions } from "easy-peasy";

import "react-table/react-table.css";
import columns from "./columns";
import filters from "./filters";
import { Wrap } from "./styles";
import { Individual } from "../../graphql/FetchIndividuals";
import FetchUsersByGroup from "../../graphql/FetchUsersByGroup";

type FilterData = {
  name: string;
  items: Array<{ onClick: () => void; option: string }>;
};

const Filters = ({ filters }: { filters: Array<FilterData> }): JSX.Element => {
  return (
    <Flexbox horizontal>
      {filters.map(
        ({ items, name }, i): React.ReactNode => (
          <Spacing key={`filter-types-${i}`} margin={{ right: 20 }}>
            <Dropdown label={name} inverted>
              {items.map(
                ({ onClick, option }, i): React.ReactNode => (
                  <DropdownItem key={`options-${i}`} onClick={onClick}>
                    {option}
                  </DropdownItem>
                )
              )}
            </Dropdown>
          </Spacing>
        )
      )}
    </Flexbox>
  );
};

type TableData = {
  volunteers: Individual;
  individuals: Individual;
};

const Groups = () => {
  const { pathname } = useLocation();
  const kind = pathname.split("/")[2];
  const { push } = useHistory();
  const setTable = useStoreActions(
    (actions: { table: { setTable: ({ individuals, volunteers }) => void } }) =>
      actions.table.setTable
  );

  useEffect(() => {
    push("/groups/volunteers");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FetchUsersByGroup>
      {({
        volunteers,
        individuals,
        filters: filtersValues,
        changeFilters,
        page
      }): React.ReactNode => {
        const data: TableData = {
          volunteers: volunteers.data,
          individuals: individuals.data
        };
        setTable({
          individuals: individuals.data,
          volunteers: volunteers.data
        });

        const pages =
          kind === "volunteers"
            ? Math.ceil(volunteers.count / filtersValues.rows)
            : Math.ceil(individuals.count / filtersValues.rows);

        return (
          <Page>
            <Flexbox middle>
              <Wrap>
                <Spacing margin={{ bottom: 20 }}>
                  <Filters
                    filters={filters({
                      volunteersCount: Number(volunteers.count) || 0,
                      individualsCount: Number(individuals.count) || 0,
                      filters: { values: filtersValues, change: changeFilters },
                      history: push,
                      kind
                    })}
                  />
                </Spacing>
                <ReactTable
                  manual
                  sortable={false}
                  data={data[kind]}
                  columns={columns(pathname)}
                  pageSize={filtersValues.rows}
                  page={page}
                  pages={pages}
                  onPageChange={(page: number): void => changeFilters({ page })}
                  onPageSizeChange={(rows: number): void =>
                    changeFilters({ rows })
                  }
                  previousText="Anterior"
                  nextText="Próximo"
                  pageText="Página"
                  ofText="de"
                  rowsText="linhas"
                  // Accessibility Labels
                  className="-striped -highlight"
                />
              </Wrap>
            </Flexbox>
          </Page>
        );
      }}
    </FetchUsersByGroup>
  );
};

export default Groups;
