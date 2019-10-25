import React from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Flexbox2 as Flexbox, Title, Loading } from 'bonde-styleguide'

const styles = {
  panel: {
    width: '100%'
  }
}

const dicioService = {
  lawyer: 'Advogadas',
  therapist: 'Psicólogas',
  individual: 'MSRs'
}

const addAccessorIndividual = (columns) => [
  ...columns.slice(0, 4),
  {
    accessor: 'status_acolhimento',
    Header: 'Status Acolhimento',
    Cell: ({value}) => value && value.map(i => (
      <React.Fragment>
        <span>{i}</span>
        <br />
      </React.Fragment>
    ))
  },
  ...columns.slice(5)
]

const addAccessorVolunteer = (columns) => [
  ...columns.slice(0, 4),
  {
    accessor: 'status_inscricao',
    Header: 'Status Inscrição',
    Cell: ({value}) => value && value.map(i => (
      <React.Fragment>
        <span>{i}</span>
        <br />
      </React.Fragment>
    ))
  },
  ...columns.slice(5)
]

const columns = [
  {
    accessor: 'name',
    Header: 'Nome'
  },
  {
    accessor: 'email',
    Header: 'Email'
  },
  {
    accessor: 'address',
    Header: 'Endereço de atendimento'
  },
  {
    accessor: 'distance',
    Header: 'Distância (km)'
  },
  {
    accessor: 'disponibilidade_de_atendimentos',
    Header: 'Disponibilidade de atendimento'
  },
  {
    accessor: 'encaminhamentos',
    Header: 'Encaminhamentos realizados'
  },
  {
    accessor: 'atendimentos_em_andamento',
    Header: 'Atendimentos em andamento'
  },
  {
    accessor: 'encaminhamentos_realizados_calculado_',
    Header: 'Encaminhamentos realizados [calculado]'
  },
  {
    accessor: 'atendimentos_em_andamento_calculado_',
    Header: 'Atendimentos em andamento [calculado]'
  },
  {
    accessor: 'link_ticket',
    Header: 'Link do ticket',
    Cell: ({value}) => value && value.map(i => (
      <React.Fragment>
        <a href={`https://mapadoacolhimento.zendesk.com/agent/tickets/${i}`}>{i}</a>
        <br />
      </React.Fragment>
    ))
  },
  {
    accessor: 'data_de_inscricao_no_bonde',
    Header: 'Data de inscrição no BONDE'
  },
  {
    accessor: 'occupation_area',
    Header: 'Área de atuação'
  },
  {
    accessor: 'phone',
    Header: 'Telefone'
  },
  {
    accessor: 'whatsapp',
    Header: 'Whatsapp'
  },
  {
    accessor: 'registration_number',
    Header: 'Número de registro (OAB, CRM ou CRP)'
  }
]


const FullWidth = ({ children }) => (
  <div style={styles.panel}>
    {children}
  </div>
)

class Dataset extends React.Component {

  state = {
    json: [],
    loading: false
  }

  getEndpoint () {
    const { params } = this.props

    const url = new URL(`${window.location.href}api`)
    Object.keys(params).forEach(
      key => url.searchParams.append(key, params[key])
    )

    return url
  }

  componentDidMount () {
    this.setState({ loading: true })

    fetch(this.getEndpoint())
      .then(res => {
        res.json().then(values => {
          this.setState({ json: values, loading: false })
        })
      })
  }

  render () {
    const { json, loading } = this.state
    const { params: {
      distance, serviceType
    } } = this.props

    return loading ? (
      <Flexbox horizontal spacing='around'>
        <Loading />
      </Flexbox>
    ) : (
      <FullWidth>
        <Flexbox vertical>
          <Title.H2 margin={{ bottom: 20 }}>Match realizado!</Title.H2>
          <Title.H4 margin={{ bottom: 30 }}>
            {`${json.length} ${dicioService[serviceType]} encontradas em um raio de ${distance}km.`}
          </Title.H4>
          <ReactTable
            data={json}
            columns={['lawyer', 'therapist'].includes(serviceType) ? addAccessorVolunteer(columns) : addAccessorIndividual(columns)}
            defaultPageSize={10}
            className="-striped -highlight"
          />
        </Flexbox>
      </FullWidth>
    )
  }
}

Dataset.propTypes = {
  params: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
    serviceType: PropTypes.oneOf(['lawyer', 'therapist', 'individual'])
  }).isRequired
}

export default Dataset
