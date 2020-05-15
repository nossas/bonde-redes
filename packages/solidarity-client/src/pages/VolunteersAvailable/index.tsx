import React, { useEffect } from "react";
import ReactTable from "react-table";
import styled from "styled-components";
import { useStoreState, useStoreActions } from "easy-peasy";
import { Header } from "bonde-components";
import "react-table/react-table.css";
import columns from "./columns";
import Loading from "../../components/Loading";

export const FullWidth = styled.div`
  width: 100%;
  padding: 40px;
`;

const Table: React.FC = () => {
  const tableData = useStoreState(state => state.volunteers.volunteers);
  const getAvailableVolunteers = useStoreActions(
    (actions: any) => actions.volunteers.getAvailableVolunteers
  );

  useEffect(() => {
    getAvailableVolunteers();
  }, [getAvailableVolunteers]);

  if (tableData === "pending")
    return <Loading text="Buscando voluntárias disponíveis..." />;

  return tableData.length === 0 ? (
    <div style={{ height: "calc(100vh - 200px)" }}>
      <Header.h3 style={{ margin: 30 }}>
        Não existem voluntárias disponíveis.
      </Header.h3>
    </div>
  ) : (
    <FullWidth>
      <div style={{ width: "100%", height: "100%", flexDirection: "column" }}>
        <Header.h2 margin={{ bottom: 20 }}>Voluntárias Encontradas!</Header.h2>
        <Header.h4 margin={{ bottom: 30 }}>
          {`${tableData.length} voluntárias disponíveis encontradas.`}
        </Header.h4>
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
      </div>
    </FullWidth>
  );
};

export default Table;
