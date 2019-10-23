import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Flexbox2 as Flexbox,
  FormField,
  Input,
  Select
} from 'bonde-styleguide'
import MapsSearchInput from './MapsSearchInput'

class SearchForm extends React.Component {
 
  state = {
    geolocation: undefined,
    distance: 80,
    serviceType: ''
  }

  handleSubmit (evt) {
    evt.preventDefault()
    this.props.onSubmit(this.state)
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <MapsSearchInput
          name='address'
          label='Endereço'
          placeholder='Digite o endereço'
          onChangeLocation={(geolocation) => this.setState({ geolocation })}
          value={this.state.geolocation}
        /> 
        <FormField
          name='distance'
          label='Distância (km)'
          placeholder='Informe o raio de busca'
          type='number'
          inputComponent={Input}
          onChange={(e) => this.setState({ distance: e.target.value })}
          value={this.state.distance}
        />
        <FormField
          name='serviceType'
          label='Tipo de atendimento'
          placeholder='Digite o endereço'
          inputComponent={Select}
          onChange={(e) => this.setState({ serviceType: e.target.value })}
          value={this.state.serviceType}
          native
        >
          <option value=''>Selecione</option>
          <option value='therapist'>Terapeuta</option>
          <option value='lawyer'>Advogada</option>
          <option value='individual'>MSR</option>
        </FormField>
        <Flexbox horizontal end>
          <Button
            type='submit'
            disabled={(
              this.state.geolocation === undefined
                || this.state.serviceType === ''
            )}
          >
            Buscar
          </Button>
        </Flexbox>
      </form>
    )
  }
}

SearchForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default SearchForm
