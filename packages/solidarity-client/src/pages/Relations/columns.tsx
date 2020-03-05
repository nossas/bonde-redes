import React from 'react'

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
    ) : '-'),
  }, {
    accessor: 'created_at',
    Header: 'Data de criação do ticket',
    Cell: ({ value }) => {
      if (!value) {
        return '-'
      }
      const data = new Date(value)
      return data.toLocaleDateString('pt-BR')
    },
  }, {
    accessor: '',
    Header: 'Relação',
    width: 150
  }, {
    accessor: 'status',
    Header: 'Status',
    width: 150
  }, {
    accessor: 'update_at',
    Header: 'Última atualização',
    width: 300,
  }, {
    accessor: 'agent',
    Header: 'Feito por',
    Cell: ({ value }) => (value ? (
      <span>{value.first_name}</span>
    ) : '-'),
  },
]

export default columns
