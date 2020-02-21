import React from 'react'

const columns = [
  {
    accessor: 'volunteer',
    Header: 'Voluntária',
    width: 200,
  },
  {
    accessor: 'individual',
    Header: 'PSR',
    width: 200,
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
    accessor: 'relation',
    Header: 'Relação',
    Cell: ({ value }) => (value ? (
      <span>{value}</span>
    ) : '-'),
    width: 200
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
    Header: 'Feito Por',
  }
]

export default columns
