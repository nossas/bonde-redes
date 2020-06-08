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
    <div style={{ height: "calc(100vh - 130px)" }}>
      <Header.h4 style={{ margin: 30 }}>
        Não existem voluntárias disponíveis.
      </Header.h4>
    </div>
  ) : (
    <>
      <Header.h4 margin={{ bottom: 30 }}>
        Voluntárias Encontradas! ({tableData.length})
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
    </>
  );
};

export default Table;
