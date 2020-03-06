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
  },{
    accessor: 'status',
    Header: 'Status',
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
]

export default columns
