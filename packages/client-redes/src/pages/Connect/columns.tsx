import React from 'react'
import BtnConnect from '../../components/BtnConnect'
import { Flexbox2 as Flexbox } from 'bonde-styleguide'

type valueString = {
  value: string
}

const columns = [
  {
    accessor: 'first_name',
    Header: 'Nome',
    width: 200,
  }, {
    accessor: 'email',
    Header: 'Email',
    width: 200,
  }, {
    accessor: 'distance',
    Header: 'Distância (km)',
    width: 150
  }, {
    accessor: 'address',
    Header: 'Endereço',
    width: 300,
  }, {
    accessor: 'priority',
    Header: 'Prioridade',
  },
  {
    accessor: 'created_at',
    Header: 'Data de criação',
    Cell: ({ value }: valueString) => {
      if (!value) {
        return '-'
      }
      const data = new Date(value)
      return data.toLocaleDateString('pt-BR')
    },
  }, {
    accessor: 'id',
    Header: 'Ação',
    width: 200,
    Cell: ({ value, row }) => (value ? (
      <Flexbox middle><BtnConnect individual={row._original} /></Flexbox>
    ) : null),
  }
]

export default columns
