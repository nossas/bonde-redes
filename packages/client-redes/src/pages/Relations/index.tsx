import React from "react";
import ReactTable from "react-table";
import styled from "styled-components";
import FetchMatches from "../../graphql/FetchMatches";
import { Header } from "bonde-components";

import "react-table/react-table.css";
import columns from "./columns";
import { Relationship } from "../../graphql/FetchMatches";

export const Wrap = styled.div`
  padding: 20px 0;

  ${Header.h4} {
    margin: 0 0 15px;
  }
`;

const Table: React.FC = () => {
  return (
    <FetchMatches>
      {(data: Array<Relationship>): React.ReactNode => {
        return data.length === 0 ? (
          <Wrap>
            <Header.h4>
              Não existem conexões realizadas nessa comunidade.
            </Header.h4>
          </Wrap>
        ) : (
          <Wrap>
            <Header.h4>Relações ({data.length})</Header.h4>
            <ReactTable
              data={data}
              columns={columns}
              defaultPageSize={10}
              className="-striped -highlight"
              defaultSorted={[
                {
                  id: "created_at",
                  desc: true
                }
              ]}
            />
          </Wrap>
        );
      }}
    </FetchMatches>
  );
};

export default Table;
