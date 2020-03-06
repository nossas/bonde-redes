import React from 'react'
import SelectStatus from '../../components/SelectStatus'
import { Text } from 'bonde-styleguide'

const status = [
  'encaminhamento_realizado',
  'atendimento_iniciado',
  'atendimento_concluído',
  'atendimento_interrompido'
]

const TextHeader = ({ value }) => (
  <Text fontSize={13} fontWeight={600}>{value.toUpperCase()}</Text>
)
const TextCol = ({ value }) => (
  <Text color='#000'>{value}</Text>
)

const columns = [
  {
    accessor: 'volunteer',
    Header: 'Voluntária',
    Cell: ({ value }) => (value ? (
      <span>{value.first_name}</span>
    ) : '-'),
  }, {
    accessor: 'recipient',
    Header: 'PSR',
    Cell: ({ value }) => (value ? (
      <span>{value.first_name}</span>
    ) : '-')
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
  }, {
    accessor: 'relation',
    Header: 'Relação',
  }, {
    accessor: 'status',
    Header: 'Status',
    Cell: ({ value }) => (value ? (
      <SelectStatus
        options={status}
        selected={value}
      />
    ) : null),
    width: 250
  }, {
    accessor: 'updated_at',
    Header: 'Última atualização',
    Cell: ({ value }) => {
      if (!value) {
        return '-'
      }
      const data = new Date(value)
      return data.toLocaleDateString('pt-BR')
    },
  }, {
    accessor: 'agent',
    Header: 'Feito por',
    Cell: ({ value }) => (value ? (
      <span>{value.first_name}</span>
    ) : '-'),
  },
].map((col: any) => !!col.Cell
? {...col, Header: () => <TextHeader value={col.Header} />}
: {...col, Header: () => <TextHeader value={col.Header} />, Cell: TextCol}
)

export default columns
