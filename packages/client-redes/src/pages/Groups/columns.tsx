import React from 'react'
import { 
  Flexbox2 as Flexbox, 
  Text,
} from 'bonde-styleguide'
import SelectUpdateStatus from '../../components/SelectUpdateStatus'
import history from '../../history'
import { BtnInverted } from './styles'
import UPDATE_INDIVIDUAL_MUTATION from '../../graphql/UpdateIndividual'

const TextHeader = ({ value }) => (
  <Text fontSize={13} fontWeight={600}>{value.toUpperCase()}</Text>
)

const TextCol = ({ value }) => (
  <Text color='#000'>{value}</Text>
)

const DateText = ({ value }) => {
  if (!value) {
    return '-'
  }
  const data = new Date(value)
  return data.toLocaleDateString('pt-BR')
}

const ExtraCol = (accessor: string) => ({ value }) => (value ? (
  <span>{value[accessor]}</span>
) : '-')

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
    Cell: ({ value, row }): any => (value ? (
      <SelectUpdateStatus
        name='status'
        row={row}
        options={status}
        selected={value}
        type="individual"
        query={UPDATE_INDIVIDUAL_MUTATION}
      />
    ) : null),
    width: 150
  }, {
    accessor: 'availability',
    Header: 'Disponibilidade',
    Cell: ({ value, row }): any => (value ? (
      <SelectUpdateStatus
        name='availability'
        row={row}
        options={availability}
        selected={value}
        type="individual"
        query={UPDATE_INDIVIDUAL_MUTATION}
      />
    ) : null),
    width: 150
  }, {
    accessor: 'extras',
    Header: 'Número de Registro',
    Cell: ExtraCol('register_occupation'),
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
    accessor: 'created_at',
    Header: 'Data de criação',
    Cell: DateText,
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
            onClick={() => history.push({
              pathname: '/connect',
              search: `?id=${value}`,
              state: { volunteer: row._original }
            })}
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
    accessor: 'extras',
    Header: 'Data de nascimento',
    Cell: ExtraCol('birth_date')
  }, {
    accessor: 'email',
    Header: 'Email',
  }, {
    accessor: 'status',
    Header: 'Status',
    Cell: ({ value, row }): any => (value ? (
      <SelectUpdateStatus
        name='status'
        row={row}
        options={status}
        selected={value}
        type="individual"
        query={UPDATE_INDIVIDUAL_MUTATION}
      />
    ) : null),
    width: 150
  }, {
    accessor: 'availability',
    Header: 'Disponibilidade',
    Cell: ({ value, row }): any => (value ? (
      <SelectUpdateStatus
        name='availability'
        row={row}
        options={availability}
        selected={value}
        type="individual"
        query={UPDATE_INDIVIDUAL_MUTATION}
      />
    ) : null),
    width: 150
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
    Cell: DateText,
  },
].map((col: any) => !!col.Cell
  ? {...col, Header: () => <TextHeader value={col.Header} />}
  : {...col, Header: () => <TextHeader value={col.Header} />, Cell: TextCol}
)

const dicio = {
  "/groups/volunteers": volunteersColumns,
  "/groups/individuals": individualsColumns
}

export default function columns(location) { return dicio[location] }
