import React from 'react'
import { Flexbox2 as Flexbox, Button, Text } from 'bonde-styleguide'
import { Link } from 'react-router-dom'

const TextHeader = ({ value }) => (
  <Text fontSize={13} fontWeight={600}>{value.toUpperCase()}</Text>
)

const TextCol = ({ value }) => (
  <Text color='#000'>{value}</Text>
)

const volunteersColumns = [  {
    accessor: 'first_name',
    Header: 'Nome',
    width: 100
  }, {
    accessor: 'last_name',
    Header: 'Sobrenome'
  },
  {
    accessor: 'email',
    Header: 'Email',
    width: 200
  }, {
    accessor: 'status',
    Header: 'Status'
  }, {
    accessor: 'availability',
    Header: 'Disponibilidade',
    width: 150
  }, {
    accessor: 'zipcode',
    Header: 'CEP',
    width: 100
  }, {
    accessor: 'whatsapp',
    Header: 'Whatsapp'
  }, {
    accessor: 'phone',
    Header: 'Telefone'
  }, {
    accessor: 'id',
    Header: 'Ação',
    width: 200,
    Cell: ({ value }) => (value ? (
      <Flexbox middle>
        <Link
          to={{
            pathname: "/connect",
            search: `?id=${value}`
          }}
        >
          <Button light>FAZER MATCH</Button>
        </Link>
      </Flexbox>
    ) : null),
  }
].map((col: any) => !!col.Cell
  ? {...col, Header: () => <TextHeader value={col.Header} />}
  : {...col, Header: () => <TextHeader value={col.Header} />, Cell: TextCol}
)

const individualsColumns = [
  {
    accessor: 'first_name',
    Header: 'Nome',
  }, {
    accessor: 'last_name',
    Header: 'Sobrenome',
  },
  {
    accessor: 'email',
    Header: 'Email',
  },
  {
    accessor: 'zipcode',
    Header: 'CEP',
    width: 100
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
].map((col: any) => !!col.Cell
  ? {...col, Header: () => <TextHeader value={col.Header} />}
  : {...col, Header: () => <TextHeader value={col.Header} />, Cell: TextCol}
)

const dicio = {
  "/groups/volunteers": volunteersColumns,
  "/groups/individuals": individualsColumns
}

export default function columns(location) { return dicio[location] }
