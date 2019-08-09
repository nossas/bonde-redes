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

const columns = [
  {
    accessor: 'name',
    Header: 'Nome'
  },
  {
    accessor: 'user_fields.address',
    Header: 'Endereço de atendimento'
  },
  {
    accessor: 'distance',
    Header: 'Distância (km)'
  },
  {
    accessor: 'user_fields.disponibilidade_de_atendimentos',
    Header: 'Disponibilidade de atendimento'
  },
  {
    accessor: 'user_fields.encaminhamentos',
    Header: 'Encaminhamentos realizados'
  },
  {
    accessor: 'user_fields.atendimentos_em_andamento',
    Header: 'Atendimentos em andamento'
  },
  {
    accessor: 'user_fields.occupation_area',
    Header: 'Área de atuação'
  },
  {
    accessor: 'phone',
    Header: 'Telefone'
  },
  {
    accessor: 'user_fields.whatsapp',
    Header: 'Whatsapp'
  },
  {
    accessor: 'user_fields.registration_number',
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

    const url = new URL(`${window.location.href}/api`)
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
    const { params } = this.props

    return loading ? (
      <Flexbox horizontal spacing='around'>
        <Loading />
      </Flexbox>
    ) : (
      <FullWidth>
        <Flexbox vertical>
          <Title.H2 margin={{ bottom: 20 }}>Match realizado!</Title.H2>
          <Title.H4 margin={{ bottom: 30 }}>
            {`${json.length} voluntárias encontradas em um raio de ${params.distance}km.`}
          </Title.H4>
          <ReactTable
            data={json}
            columns={columns}
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
    serviceType: PropTypes.oneOf(['lawyer', 'therapist'])
  }).isRequired
}

export default Dataset
