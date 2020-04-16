import React, { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  Flexbox2 as Flexbox,
  Spacing,
  Dropdown,
  DropdownItem,
  Title
} from "bonde-styleguide";
import { Header } from "bonde-components";
import ReactTable from "react-table";
import { useStoreActions } from "easy-peasy";

import "react-table/react-table.css";
import columns from "./columns";
import FiltersData from "./filters";
import { Wrap } from "./styles";
import { Individual } from "../../types/Individual";
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
        groups,
        filters,
        changeFilters
      }): React.ReactNode => {
        const data: TableData = {
          volunteers: volunteers.data,
          individuals: individuals.data
        };
        setTable({
          individuals: individuals.data,
          volunteers: volunteers.data
        });

        const count = {
          volunteers: Number(volunteers.count) || 0,
          individuals: Number(individuals.count) || 0
        };

        const pages =
          kind === "volunteers"
            ? Math.ceil(count.volunteers / filters.rows)
            : Math.ceil(count.individuals / filters.rows);

        const resizeRow = count[kind] < 1000 ? count[kind] : filters.rows;

        return (
          <Wrap>
            {data[kind].length === 0 ? (
              <Wrap>
                <Header.h4>Não existem resultados para essa tabela.</Header.h4>
              </Wrap>
            ) : (
              <>
                <Header.h4>Total ({count[kind]})</Header.h4>
                <Spacing margin={{ bottom: 20 }}>
                  <Filters
                    filters={FiltersData({
                      volunteersCount: count.volunteers,
                      individualsCount: count.individuals,
                      filters: { values: filters, change: changeFilters },
                      history: push,
                      kind,
                      groups
                    })}
                  />
                </Spacing>
                <Spacing margin={{ bottom: 20 }}>
                  <Title.H4 margin={{ bottom: 30 }}>
                    Total ({count[kind]})
                  </Title.H4>
                </Spacing>
                <ReactTable
                  manual
                  sortable={false}
                  data={data[kind]}
                  columns={columns(pathname)}
                  pageSize={resizeRow}
                  pageSizeOptions={[25, 50, 100, 200, 500, 1000]}
                  page={filters.page}
                  pages={pages}
                  onPageChange={(page: number): void =>
                    changeFilters({ type: "page", value: page })
                  }
                  onPageSizeChange={(rows: number): void =>
                    changeFilters({ type: "rows", value: rows })
                  }
                  previousText="Anterior"
                  nextText="Próximo"
                  pageText="Página"
                  ofText="de"
                  rowsText="linhas"
                  // Accessibility Labels
                  className="-striped -highlight"
                />
              </>
            )}
          </Wrap>
        );
      }}
    </FetchUsersByGroup>
  );
};

export default Groups;
