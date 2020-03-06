import React from 'react'
import { 
  Flexbox2 as Flexbox, 
  Text,
} from 'bonde-styleguide'
import styled from 'styled-components'
import SelectUpdateIndividual from '../../graphql/SelectUpdateIndividual'
import history from '../../history'
import { BtnInverted } from './styles'

const TextHeader = ({ value }) => (
  <Text fontSize={13} fontWeight={600}>{value.toUpperCase()}</Text>
)
const TextCol = ({ value }) => (
  <Text color='#000'>{value}</Text>
)

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

const volunteersColumns = [  
  {
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
    width: 150
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
    width: 150
  }, {
    accessor: 'extra',
    Header: 'Número de Registro',
    Cell: ({ value }) => (value ? (
      <span>{value.register_ocupation}</span> 
    ) : '-'),
    width: 170
  }, {
    accessor: 'address',
    Header: 'Endereço',
    width: 300,
    Cell: ({ value }) => (value ? (
      <span>{value === 'ZERO_RESULTS' ? 'CEP Inválido' : value}</span> 
    ) : '-'),
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
    Cell: ({ value, row }) => (
      value ? (
        <Flexbox middle>
          <BtnInverted 
            disabled={
              row._original.availability !== 'disponível' ||
              row._original.status !== 'aprovada'
            }
            onClick={() => history.push(`/connect?id=${value}`)}
          >
            FAZER MATCH
          </BtnInverted>
        </Flexbox>
      ) : null
    ),
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
  }, {
    accessor: 'email',
    Header: 'Email',
  }, {
    accessor: 'address',
    Header: 'Endereço',
    width: 100
  }, {
    accessor: 'zipcode',
    Header: 'CEP',
    width: 100
  }, {
    accessor: 'phone',
    Header: 'Telefone'
  }, {
    accessor: 'created_at',
    Header: 'Data de criação',
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
