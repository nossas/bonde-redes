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
import Select from './Select'
import dicioService from './Table/dicioService'

interface Props {
  onSubmit: () => void
}

const Form: React.FC<Props> = ({ onSubmit }) => {
  const {
    form: { distanceRef, serviceTypeRef, geolocationRef },
  } = GlobalContext

  const distance = useStateLink(distanceRef)
  const serviceType = useStateLink(serviceTypeRef)
  const geolocation = useStateLink(geolocationRef)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit()
  }

  const renderOptions = () => {
    const keys = Object.keys(dicioService) as Array<keyof typeof dicioService>

    return keys.map((i) => (
      <option key={i} value={i}>{dicioService[i]}</option>
    ))
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
      <Select
        label="Tipo de atendimento"
        value={serviceType.value}
        onChange={(e) => serviceType.set(e.target.value)}
      >
        {renderOptions()}
      </Select>
      <Flexbox horizontal end>
        <Button
          type="submit"
          disabled={(
            geolocation.value === undefined
            || serviceType.value === 'default'
          )}
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
