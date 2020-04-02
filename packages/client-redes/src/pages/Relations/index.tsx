import React from "react";
import ReactTable from "react-table";
import styled from "styled-components";
import FetchMatches from "../../graphql/FetchMatches";
import { Flexbox2 as Flexbox, Title, Spacing } from "bonde-styleguide";

import "react-table/react-table.css";
import columns from "./columns";
import { Relationship } from "../../graphql/FetchMatches";

export const Wrap = styled.div`
  width: 90%;
  margin: 40px;
`;

const Table: React.FC = () => {
  return (
    <FetchMatches>
      {(data: Array<Relationship>): React.ReactNode => {
        return data.length === 0 ? (
          <Flexbox middle>
            <Wrap>
              <Title.H4 margin={{ bottom: 30 }}>
                Não existem conexões realizadas nessa comunidade.
              </Title.H4>
            </Wrap>
          </Flexbox>
        ) : (
          <Flexbox middle>
            <Wrap>
              <Spacing margin={{ bottom: 20 }}>
                <Title.H4 margin={{ bottom: 30 }}>
                  Relações ({data.length})
                </Title.H4>
              </Spacing>
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
          </Flexbox>
        );
      }}
    </FetchMatches>
  );
};

export default Table;
