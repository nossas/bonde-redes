/* eslint-disable react/display-name */
import React from "react";
import { Flexbox2 as Flexbox, Text } from "bonde-styleguide";
import SelectUpdateStatus from "../../components/SelectUpdateStatus";
import history from "../../history";
import { BtnInverted } from "./styles";
import UPDATE_INDIVIDUAL_MUTATION from "../../graphql/UpdateIndividual";

type valueString = {
  value: string;
};

type valueAndRow = {
  value: string;
  row: {
    _original: {
      id: number;
    };
  };
};

const TextHeader = ({ value }: valueString): JSX.Element => (
  <Text fontSize={13} fontWeight={600}>
    {value.toUpperCase()}
  </Text>
);

const TextCol = ({ value }: valueString): React.ReactNode => (
  <Text color="#000">{value}</Text>
);

const DateText = ({ value }: valueString): React.ReactNode => {
  if (!value) {
    return "-";
  }
  const data = new Date(value);
  return data.toLocaleDateString("pt-BR");
};

const ExtraCol = (accessor: string) => ({
  value
}: valueString): React.ReactNode =>
  value ? <span>{value[accessor]}</span> : "-";

const status = ["inscrita", "reprovada", "aprovada"];

const availability = [
  "disponível",
  "indisponível",
  "anti-ética",
  "férias",
  "licença",
  "descadastrada"
];

const volunteersColumns: Array<Columns> = [
  {
    accessor: "first_name",
    Header: "Nome",
    width: 100
  },
  {
    accessor: "last_name",
    Header: "Sobrenome"
  },
  {
    accessor: "email",
    Header: "Email",
    width: 200
  },
  {
    accessor: "status",
    Header: "Status",
    Cell: ({ value, row }: valueAndRow): JSX.Element | null =>
      value && row ? (
        <SelectUpdateStatus
          name="status"
          row={row}
          options={status}
          selected={value}
          type="individual"
          query={UPDATE_INDIVIDUAL_MUTATION}
        />
      ) : null,
    width: 150
  },
  {
    accessor: "availability",
    Header: "Disponibilidade",
    Cell: ({ value, row }: valueAndRow): JSX.Element | null =>
      value ? (
        <SelectUpdateStatus
          name="availability"
          row={row}
          options={availability}
          selected={value}
          type="individual"
          query={UPDATE_INDIVIDUAL_MUTATION}
        />
      ) : null,
    width: 150
  },
  {
    accessor: "extras",
    Header: "Número de Registro",
    Cell: ExtraCol("register_occupation"),
    width: 170
  },
  {
    accessor: "address",
    Header: "Endereço",
    width: 300,
    Cell: ({ value }: valueString): JSX.Element | string =>
      value ? (
        <span>{value === "ZERO_RESULTS" ? "CEP Inválido" : value}</span>
      ) : (
        "-"
      )
  },
  {
    accessor: "zipcode",
    Header: "CEP",
    width: 100
  },
  {
    accessor: "whatsapp",
    Header: "Whatsapp"
  },
  {
    accessor: "phone",
    Header: "Telefone"
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
    Cell: ({
      value,
      row
    }: {
      value: number;
      row: { _original: { availability: string; status: string } };
    }): React.ReactNode | null =>
      value ? (
        <Flexbox middle>
          <BtnInverted
            disabled={
              row._original.availability !== "disponível" ||
              row._original.status !== "aprovada"
            }
            onClick={(): void =>
              history.push({
                pathname: "/connect",
                state: { volunteer: row._original }
              })
            }
          >
            FAZER MATCH
          </BtnInverted>
        </Flexbox>
      ) : null
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

const individualsColumns: Array<Columns> = [
  {
    accessor: "first_name",
    Header: "Nome"
  },
  {
    accessor: "last_name",
    Header: "Sobrenome"
  },
  {
    accessor: "extras",
    Header: "Data de nascimento",
    Cell: ExtraCol("birth_date")
  },
  {
    accessor: "email",
    Header: "Email"
  },
  {
    accessor: "status",
    Header: "Status",
    Cell: ({ value, row }: valueAndRow): React.ReactNode | null =>
      value ? (
        <SelectUpdateStatus
          name="status"
          row={row}
          options={status}
          selected={value}
          type="individual"
          query={UPDATE_INDIVIDUAL_MUTATION}
        />
      ) : null,
    width: 150
  },
  {
    accessor: "address",
    Header: "Endereço",
    width: 100
  },
  {
    accessor: "zipcode",
    Header: "CEP",
    width: 100
  },
  {
    accessor: "phone",
    Header: "Telefone"
  },
  {
    accessor: "created_at",
    Header: "Data de criação",
    Cell: DateText
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

const dicio = {
  "/groups/volunteers": volunteersColumns,
  "/groups/individuals": individualsColumns
};

interface Columns {
  accessor: string;
  Header: string;
  Cell?: (any) => string | JSX.Element | null;
  width?: number;
}

export default function columns(location: string): Array<Columns> {
  return dicio[location];
}
