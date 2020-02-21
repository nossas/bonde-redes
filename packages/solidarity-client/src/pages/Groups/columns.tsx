import React from 'react'
import { Flexbox2 as Flexbox } from 'bonde-styleguide'
import BtnForward from '../../components/BtnForward'

export const volunteersColumns = [
  {
    accessor: 'name',
    Header: 'Nome',
  }, {
    accessor: 'email',
    Header: 'Email',
  },
  {
    accessor: 'address',
    Header: 'Endereço',
    width: 300,
  }, 
  // {
  //   accessor: 'group',
  //   Header: 'Área de Atuação',
  //   Cell: ({ value }) => (value ? (
  //     <Flexbox middle>
  //       {value.name}
  //     </Flexbox>
  //   ) : null),
  // },{
  //   accessor: 'availability',
  //   Header: 'Vagas Disponíveis',
  // }, {
  //   accessor: 'disponibilidade_de_atendimentos',
  //   Header: 'Disponibilidade Total',
  // }, {
  //   accessor: 'atendimentos_em_andamento_calculado_',
  //   Header: 'Atendimentos em Andamento',
  // }, {
  //   accessor: 'pending',
  //   Header: 'Encaminhamentos recebidos nos últimos 30 dias',
  // }, 
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
  }, 
  {
    accessor: 'id',
    Header: 'Ação',
    width: 200,
    Cell: ({ value }) => (value ? (
      <Flexbox middle>     
        <BtnForward id={value} />
      </Flexbox>
    ) : null),
  }
]

export const individualsColumns = [
  {
    accessor: 'name',
    Header: 'Nome',
  }, {
    accessor: 'email',
    Header: 'Email',
  },
  {
    accessor: 'address',
    Header: 'Endereço',
  }, 
  // {
  //   accessor: 'group',
  //   Header: 'Área de Atuação',
  //   Cell: ({ value }) => (value ? (
  //     <Flexbox middle>
  //       {value.name}
  //     </Flexbox>
  //   ) : null),
  // },{
  //   accessor: 'availability',
  //   Header: 'Vagas Disponíveis',
  // }, {
  //   accessor: 'disponibilidade_de_atendimentos',
  //   Header: 'Disponibilidade Total',
  // }, {
  //   accessor: 'atendimentos_em_andamento_calculado_',
  //   Header: 'Atendimentos em Andamento',
  // }, {
  //   accessor: 'pending',
  //   Header: 'Encaminhamentos recebidos nos últimos 30 dias',
  // }, 
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
]

const dicio = {
  "/groups/volunteers": volunteersColumns,
  "/groups/individuals": individualsColumns
}

export default function columns(location) { return dicio[location] }
