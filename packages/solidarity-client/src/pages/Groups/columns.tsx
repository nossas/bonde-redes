import React from 'react'
import { 
  Flexbox2 as Flexbox, 
  Button, 
  Text,
} from 'bonde-styleguide'
import styled from 'styled-components'
import history from '../../history'

const TextHeader = ({ value }) => (
  <Text fontSize={13} fontWeight={600}>{value.toUpperCase()}</Text>
)

const TextCol = ({ value }) => (
  <Text color='#000'>{value}</Text>
)

const BtnInverted = styled(Button)`
  border-color: ${props => (props.disabled ? "unset" : "#EE0090")}
  color: ${props => (props.disabled ? "#fff" : "#EE0090")}
`;

BtnInverted.defaultProps = {
  light: true
}

const Select = styled.select`
  text-transform: capitalize;
  padding: 5px 0 2px 5px;
  width: 100%;
  border-bottom: 1px solid #ee0099;
  &:active, &:hover {
    box-shadow: 0 0 4px rgb(204, 204, 204);
  }
  &:hover {
    box-shadow: 0 0 4px rgb(204, 204, 204)
  }
`
const Option = styled.option`
  text-transform: capitalize;
`
const SelectStatus = ({ options, onChange, selected }) => {
  return (
    <Text color="#000">
      <Select onChange={onChange} value={selected}>
        {options.map(i => <Option value={i}>{i}</Option>)}
      </Select>
    </Text>
  )
}

const status = [
  'inscrita',
  'reprovada',
  'aprovada'
]

const availability = [
  'disponível',
  'indisponível',
  'anti-ética',
  'férias',
  'licença',
  'descadastrada', 
]

const volunteersColumns = [  
  {
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
    Header: 'Status',
    Cell: ({ value }) => (value ? (
      <SelectStatus
        options={status}
        onChange={(e) => alert(`Você alterou o status para ${e.target.value}`)}
        selected={value}
      />
    ) : null),
  }, {
    accessor: 'availability',
    Header: 'Disponibilidade',
    Cell: ({ value }) => (value ? (
      <SelectStatus
        options={availability}
        onChange={(e) => alert(`Você alterou o status para ${e.target.value}`)}
        selected={value}
      />
    ) : null),
  }, {
    accessor: 'extra',
    Header: 'Número de Registro',
    Cell: ({ value }) => (value ? (
      <span>{value.register_ocupation}</span> 
    ) : '-'),
  }, {
    accessor: 'address',
    Header: 'Endereço',
    width: 100
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
    Cell: ({ value, row }) => {
      console.log({row})
      return (
        (value ? (
          <Flexbox middle>
            <BtnInverted 
              disabled={row._original.availability === 'indisponível'}
              onClick={() => history.push(`/connect?id=${value}`)}
            >
              FAZER MATCH
            </BtnInverted>
          </Flexbox>
        ) : null)
      )
    }
    ,
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
  }, {
    accessor: 'email',
    Header: 'Email',
  }, {
    accessor: 'address',
    Header: 'Endereço',
    width: 100
  }, {
    accessor: 'zipcode',
    Header: 'CEP',
    width: 100
  },{
    accessor: 'phone',
    Header: 'Telefone'
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
