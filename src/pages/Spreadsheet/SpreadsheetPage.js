import React from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Flexbox2 as Flexbox, Title, Loading } from 'bonde-styleguide'
import columns from './columns'

const styles = {
  panel: {
    width: '100%'
  }
}

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
            columns={columns[params.serviceType]}
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
    serviceType: PropTypes.oneOf(['lawyers', 'therapist'])
  }).isRequired
}

export default Dataset
