import React from 'react'
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
    email: '',
    serviceType: ''
  }

  handleSubmit (evt) {
    evt.preventDefault();
    // TODO: Submit form properties
    console.log('values', this.state)
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
          name='email'
          label='E-mail do ativista'
          placeholder='Digite o e-mail do ativista'
          inputComponent={Input}
          onChange={(e) => this.setState({ email: e.target.value })}
          value={this.state.email}
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
        </FormField>
        <Flexbox horizontal end>
          <Button type='submit'>Buscar</Button>
        </Flexbox>
      </form>
    )
  }
}

export default SearchForm
