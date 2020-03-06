import React from 'react'
import { 
  Flexbox2 as Flexbox, 
  Button, 
  Text,
} from 'bonde-styleguide'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import SelectUpdateIndividual from '../../graphql/SelectUpdateIndividual'

const TextHeader = ({ value }) => (
  <Text fontSize={13} fontWeight={600}>{value.toUpperCase()}</Text>
)

const TextCol = ({ value }) => (
  <Text color='#000'>{value}</Text>
)

const BtnInverted = styled(Button)`
  border-color: ${props => (props.disabled ? "unset" : "#EE0090")}
  color: ${props => (props.disabled ? "#fff" : "#EE0090")}
`;

BtnInverted.defaultProps = {
  light: true
}

const status = [
  'inscrita',
  'reprovada',
  'aprovada'
]

const availability = [
  'disponível',
  'indisponível',
  'anti-ética',
  'férias',
  'licença',
  'descadastrada', 
]

const volunteersColumns = [  {
    accessor: 'first_name',
    Header: 'Nome',
    width: 100
  }, {
    accessor: 'last_name',
    Header: 'Sobrenome'
  },
  {
    accessor: 'email',
    Header: 'Email',
    width: 200
  }, {
    accessor: 'status',
    Header: 'Status',
    Cell: ({ value, row }) => (value ? (
      <SelectUpdateIndividual
        name='status'
        row={row}
        options={status}
        selected={value}
      />
    ) : null),
  }, {
    accessor: 'availability',
    Header: 'Disponibilidade',
    Cell: ({ value, row }) => (value ? (
      <SelectUpdateIndividual
        name='availability'
        row={row}
        options={availability}
        selected={value}
      />
    ) : null),
  }, {
    accessor: 'zipcode',
    Header: 'CEP',
    width: 100
  }, {
    accessor: 'whatsapp',
    Header: 'Whatsapp'
  }, {
    accessor: 'phone',
    Header: 'Telefone'
  }, {
    accessor: 'id',
    Header: 'Ação',
    width: 200,
    Cell: ({ value, row }) => {
      console.log({row})
      return (
        (value ? (
          <Flexbox middle>
            <BtnInverted 
              disabled={
                row._original.availability !== 'disponível' ||
                row._original.status !== 'aprovada'
              }
            >
              <Link
                to={{
                  pathname: "/connect",
                  search: `?id=${value}`
                }}
              >
                FAZER MATCH
              </Link>
            </BtnInverted>
          </Flexbox>
        ) : null)
      )
    }
    ,
  }
].map((col: any) => !!col.Cell
  ? {...col, Header: () => <TextHeader value={col.Header} />}
  : {...col, Header: () => <TextHeader value={col.Header} />, Cell: TextCol}
)

const individualsColumns = [
  {
    accessor: 'first_name',
    Header: 'Nome',
  }, {
    accessor: 'last_name',
    Header: 'Sobrenome',
  },
  {
    accessor: 'email',
    Header: 'Email',
  },
  {
    accessor: 'zipcode',
    Header: 'CEP',
    width: 100
  },
  {
    accessor: 'created_at',
    Header: 'Data de criação do ticket',
    Cell: ({ value }) => {
      if (!value) {
        return '-'
      }
      const data = new Date(value)
      return data.toLocaleDateString('pt-BR')
    },
  }
].map((col: any) => !!col.Cell
  ? {...col, Header: () => <TextHeader value={col.Header} />}
  : {...col, Header: () => <TextHeader value={col.Header} />, Cell: TextCol}
)

const dicio = {
  "/groups/volunteers": volunteersColumns,
  "/groups/individuals": individualsColumns
}

export default function columns(location) { return dicio[location] }
