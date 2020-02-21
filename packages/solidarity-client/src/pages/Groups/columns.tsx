import React from 'react'
import { Link } from 'react-router-dom'
import { Flexbox2 as Flexbox, Button } from 'bonde-styleguide'
import { getVolunteerType } from '../../services/utils'

export const volunteersColumns = [
  {
    accessor: 'name',
    Header: 'Nome',
  }, {
    accessor: 'email',
    Header: 'Email',
  },{
    accessor: 'organization_id',
    Header: 'Área de Atuação',
    Cell: ({ value }) => (value ? (
      <Flexbox middle>
        {getVolunteerType(value)}
      </Flexbox>
    ) : null),
  },{
    accessor: 'availability',
    Header: 'Vagas Disponíveis',
  }, {
    accessor: 'disponibilidade_de_atendimentos',
    Header: 'Disponibilidade Total',
  }, {
    accessor: 'atendimentos_em_andamento_calculado_',
    Header: 'Atendimentos em Andamento',
  }, {
    accessor: 'pending',
    Header: 'Encaminhamentos recebidos nos últimos 30 dias',
  }, {
    accessor: 'user_id',
    Header: 'Link',
    Cell: ({ value }) => (value ? (
      <a
        href={`https://mapadoacolhimento.zendesk.com/agent/users/${value}/requested_tickets`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {value}
      </a>
    ) : null),
  }, {
    accessor: 'user_id',
    Header: 'Ação',
    width: 200,
    Cell: ({ value }) => (value ? (
      <Flexbox middle>
        <Link 
          to={{
            pathname: "/connect",
            search: `id=${value}`,
          }}
        >
          <Button>fazer match</Button>
        </Link>
      </Flexbox>
    ) : null),
  }
]

const individualsColumns = []

const dicio = {
  "/groups/volunteers": volunteersColumns,
  "/groups/individuals": individualsColumns
}

export default function columns(location) { return dicio[location] }
