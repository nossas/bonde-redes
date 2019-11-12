import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Flexbox2 as Flexbox,
  FormField,
  Input,
} from 'bonde-styleguide'
import GlobalContext from 'context'
import { useStateLink } from '@hookstate/core'
import MapsSearchInput from 'pages/Search/components/MapsSearchInput'

interface Props {
  onSubmit: () => void
}

const Form: React.FC<Props> = ({ onSubmit }) => {
  const {
    form: {
      distanceRef, geolocationRef, therapistCheckboxRef, lawyerCheckboxRef, individualCheckboxRef,
    },
  } = GlobalContext

  const distance = useStateLink(distanceRef)
  const geolocation = useStateLink(geolocationRef)
  const therapistCheckbox = useStateLink(therapistCheckboxRef)
  const lawyerCheckbox = useStateLink(lawyerCheckboxRef)
  const individualCheckbox = useStateLink(individualCheckboxRef)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit}>
      <MapsSearchInput
        name="address"
        label="Endereço"
        placeholder="Digite o endereço"
        onChangeLocation={(e: any) => geolocation.set(e)}
        value={geolocation.value}
      />
      <FormField
        name="distance"
        label="Distância (km)"
        placeholder="Informe o raio de busca"
        type="number"
        inputComponent={Input}
        onChange={(e: any) => distance.set(Number(e.target.value))}
        value={distance.value}
      />
      <label htmlFor="lawyer">
        <input
          type="checkbox"
          id="lawyer"
          onChange={() => lawyerCheckbox.set((p) => !p)}
          checked={lawyerCheckbox.value}
        />
        {' '}
        Advogada
      </label>
      <br />
      <label htmlFor="therapist">
        <input
          type="checkbox"
          id="therapist"
          onChange={() => therapistCheckbox.set((p) => !p)}
          checked={therapistCheckbox.value}
        />
        {' '}
        Terapeuta
      </label>
      <br />
      <label htmlFor="individual">
        <input
          type="checkbox"
          id="individual"
          onChange={() => individualCheckbox.set((p) => !p)}
          checked={individualCheckbox.value}
        />
        {' '}
        MSR
      </label>
      <br />
      <Flexbox horizontal end>
        <Button
          type="submit"
        >
          Buscar
        </Button>
      </Flexbox>
    </form>
  )
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default Form
