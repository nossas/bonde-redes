import React from 'react'
import PropTypes from 'prop-types'
import ReactJSONView from 'react-json-view'

class Dataset extends React.Component {

  state = {
    json: {}
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
    fetch(this.getEndpoint())
      .then(res => {
        res.json().then(values => {
          this.setState({ json: values })
        })
      })
  }

  render () {
    return (
      <ReactJSONView src={this.state.json} />
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
