import React, { useEffect } from "react";
import ReactTable from "react-table";
import styled from "styled-components";

import { Flexbox2 as Flexbox, Title } from "bonde-styleguide";
import { useStoreState, useStoreActions } from "easy-peasy";

import "react-table/react-table.css";
import columns from "./columns";

export const FullWidth = styled.div`
  width: 100%;
  padding: 40px;
`;

const Table: React.FC = () => {
  const tableData = useStoreState(state => state.table.tableData);
  const getAvailableVolunteers = useStoreActions(
    (actions: any) => actions.table.getTableData
  );

  useEffect(() => {
    getAvailableVolunteers("volunteers");
  }, [getAvailableVolunteers]);

  return tableData.length === 0 ? (
    <FullWidth>
      <Flexbox>
        <Title.H4 margin={{ bottom: 30 }}>
          Não existem voluntárias disponíveis.
        </Title.H4>
      </Flexbox>
    </FullWidth>
  ) : (
    <FullWidth>
      <Flexbox vertical>
        <Title.H2 margin={{ bottom: 20 }}>Voluntárias Encontradas!</Title.H2>
        <Title.H4 margin={{ bottom: 30 }}>
          {`${tableData.length} voluntárias disponíveis encontradas.`}
        </Title.H4>
        <br />
        <ReactTable
          data={tableData}
          columns={columns}
          defaultPageSize={15}
          defaultSorted={[
            {
              id: "availability",
              desc: true
            }
          ]}
          className="-striped -highlight"
        />
      </Flexbox>
    </FullWidth>
  );
};

export default Table;
