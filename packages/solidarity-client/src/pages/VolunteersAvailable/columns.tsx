import React from 'react'

const columns = [
  {
    accessor: 'name',
    Header: 'Nome',
  }, {
    accessor: 'email',
    Header: 'Email',
  }, {
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
  }
]

export default columns
