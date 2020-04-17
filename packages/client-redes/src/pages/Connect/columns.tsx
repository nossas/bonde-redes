import React from "react";
import BtnConnect from "../../components/BtnConnect";
import { Flexbox2 as Flexbox } from "bonde-styleguide";
import { Individual } from "../../types";
import { TextHeader, TextCol, DateText } from "../../components/Columns";

interface Columns {
  accessor: string;
  Header: string;
  Cell?: (any) => string | JSX.Element | null;
  width?: number;
}

const columns: Array<Columns> = [
  {
    accessor: "first_name",
    Header: "Nome",
    width: 200
  },
  {
    accessor: "email",
    Header: "Email",
    width: 200
  },
  {
    accessor: "distance",
    Header: "Distância (km)",
    width: 150
  },
  {
    accessor: "address",
    Header: "Endereço",
    width: 300
  },
  {
    accessor: "priority",
    Header: "Prioridade"
  },
  {
    accessor: "created_at",
    Header: "Data de criação",
    Cell: DateText
  },
  {
    accessor: "id",
    Header: "Ação",
    width: 200,
    // eslint-disable-next-line react/display-name
    Cell: ({ row }: { row: { _original: Individual } }): JSX.Element | null =>
      row ? (
        <Flexbox middle>
          <BtnConnect individual={row._original} />
        </Flexbox>
      ) : null
  }
].map((col: any) =>
  !!col.Cell
    ? {
        ...col,
        Header: (): JSX.Element => <TextHeader value={col.Header} />
      }
    : {
        ...col,
        Header: (): JSX.Element => <TextHeader value={col.Header} />,
        Cell: TextCol
      }
);

export default columns;
