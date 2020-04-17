import React from "react";
import SelectUpdateStatus from "../../components/SelectUpdateStatus";
import { Text } from "bonde-styleguide";
import UPDATE_RELATIONSHIP_MUTATION from "../../graphql/UpdateRelationship";

interface Columns {
  accessor: string;
  Header: string;
  Cell?: (any) => string | JSX.Element | null;
  width?: number;
}

type valueString = {
  value: string;
};

type valueFirstName = {
  value: {
    first_name: string;
    last_name?: string;
  };
};

type valueAndRow = {
  value: string;
  row: {
    _original: {
      id: number;
    };
  };
};

const status = [
  "encaminhamento_realizado",
  "atendimento_iniciado",
  "atendimento_concluído",
  "atendimento_interrompido"
];

const TextHeader = ({ value }: valueString): JSX.Element => (
  <Text fontSize={13} fontWeight={600}>
    {value.toUpperCase()}
  </Text>
);
const TextCol = ({ value }: valueString): JSX.Element => (
  <Text color="#000">{value}</Text>
);

const columns: Array<Columns> = [
  {
    accessor: "volunteer",
    Header: "Voluntária",
    Cell: ({ value }: valueFirstName): JSX.Element | string =>
      value ? <span>{`${value.first_name} ${value.last_name}`}</span> : "-"
  },
  {
    accessor: "recipient",
    Header: "PSR",
    Cell: ({ value }: valueFirstName): JSX.Element | string =>
      value ? <span>{`${value.first_name} ${value.last_name}`}</span> : "-"
  },
  {
    accessor: "created_at",
    Header: "Data de criação",
    Cell: ({ value }: valueString): string => {
      if (!value) {
        return "-";
      }
      const data = new Date(value);
      return data.toLocaleDateString("pt-BR");
    }
  },
  {
    accessor: "status",
    Header: "Status",
    Cell: ({ value, row }: valueAndRow): JSX.Element | null =>
      value ? (
        <SelectUpdateStatus
          name="status"
          row={row}
          options={status}
          selected={value}
          query={UPDATE_RELATIONSHIP_MUTATION}
          type="relationship"
        />
      ) : null,
    width: 250
  },
  {
    accessor: "updated_at",
    Header: "Última atualização",
    Cell: ({ value }: valueString): string => {
      if (!value) {
        return "-";
      }
      const data = new Date(value);
      return data.toLocaleDateString("pt-BR");
    }
  },
  {
    accessor: "agent",
    Header: "Feito por",
    Cell: ({ value }: valueFirstName): JSX.Element | string =>
      value ? <span>{`${value.first_name} ${value.last_name}`}</span> : "-"
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
].map((col: any) =>
  !!col.Cell
    ? { ...col, Header: (): JSX.Element => <TextHeader value={col.Header} /> }
    : {
        ...col,
        Header: (): JSX.Element => <TextHeader value={col.Header} />,
        Cell: TextCol
      }
);

export default columns;
