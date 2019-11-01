import React from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Flexbox2 as Flexbox, Title, Loading } from 'bonde-styleguide'

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
