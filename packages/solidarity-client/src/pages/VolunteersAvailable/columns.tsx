import React from 'react'
import { Link } from 'react-router-dom'
import { Flexbox2 as Flexbox, Button } from 'bonde-styleguide'
// import { getVolunteerType } from '../../services/utils'

const columns = [
  {
    accessor: 'name',
    Header: 'Nome',
  }, {
    accessor: 'email',
    Header: 'Email',
  },
  // {
  //   accessor: 'organization_id',
  //   Header: 'Área de Atuação',
  //   Cell: ({ value }) => (value ? (
  //     <Flexbox middle>
  //       {getVolunteerType(value)}
  //     </Flexbox>
  //   ) : null),
  // },
  {
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
    accessor: 'email',
    Header: 'Ação',
    width: 200,
    Cell: ({ value }) => (value ? (
      <Flexbox middle>
        <Link
          to={{
            pathname: "/match",
            search: `email=${value}`,
          }}
        >
          <Button>Pesquisar</Button>
        </Link>
      </Flexbox>
    ) : null),
  }
]

export default columns
