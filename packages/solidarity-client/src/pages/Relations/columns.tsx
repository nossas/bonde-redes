import React from 'react'

const columns = [
  {
    accessor: 'volunteer',
    Header: 'Voluntária',
    Cell: ({ value }) => (value ? (
      <span>{value.name}</span>
    ) : '-'),
  }, {
    accessor: 'recipient',
    Header: 'PSR',
    Cell: ({ value }) => (value ? (
      <span>{value.name}</span>
    ) : '-'),
  },{
    accessor: 'status',
    Header: 'Status',
    width: 150
  }, {
    accessor: 'update_at',
    Header: 'Última atualização',
    width: 300,
  }, {
    accessor: 'agent',
    Header: 'Agente',
    Cell: ({ value }) => (value ? (
      <span>{value.name}</span>
    ) : '-'),
  },
]

export default columns
