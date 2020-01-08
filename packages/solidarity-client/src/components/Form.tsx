import React from 'react'
// import PropTypes from 'prop-types'
import {
  Button,
  Flexbox2 as Flexbox,
  FormField,
  Input,
} from 'bonde-styleguide'
import styled from 'styled-components'
import { useStoreActions } from 'easy-peasy'
import { useForm } from 'react-hook-form'

import MapsSearchInput from './Search/MapsSearchInput'

// interface Props {
//   onSubmit: () => void
// }

const FormWrapper = styled.form`
  width: 70%;
  display: flex;
  align-items: center;
  justify-content: space-around;
`
const StyledField = styled(FormField)`
  padding: 0;
  color: rgba(255, 255, 255, 1);
  position: relative;
  top: 16px;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`

const LabelsWrapper = styled.div`
  display: flex;
  margin-bottom: 10px;
`

const StyledLabel = styled.label`
  font-size: 13px;
  font-weight: 400;
  font-style: normal;
  line-height: 1.15;
  color: rgba(170, 170, 170, 1);
  padding-right: 10px;
`

const Form: React.FC = () => {

  const {
    register,
    setValue,
    handleSubmit,
    getValues
  } = useForm()
  const setForm = useStoreActions((actions: any) => actions.geobonde.setForm)

  React.useEffect(() => {
    register({ name: "geolocation" })
    register({ name: "distance" })
  }, [register])

  const handleChange = (field: string, value: string | number) => setValue(field, value)

  const onSubmit = (data: object, e: any) => {
    e.preventDefault()
    setForm(data)
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <MapsSearchInput
        name="address"
        label="Endereço"
        placeholder="Digite o endereço"
        onChangeLocation={(e: any) => handleChange("geolocation", e)}
        value={getValues().geolocation}
      />
      <StyledField
        name="distance"
        label="Distância (km)"
        placeholder="Informe o raio de busca"
        type="number"
        inputComponent={Input}
        onChange={(e: any) => handleChange("distance", Number(e.target.value))}
      />
      <Column>
        <LabelsWrapper>
          <StyledLabel htmlFor="lawyer">
            <input
              type="checkbox"
              name="lawyer"
              ref={register}
            />
            {' '}
            Advogada
          </StyledLabel>
          <br />
          <StyledLabel htmlFor="therapist">
            <input
              type="checkbox"
              name="therapist"
              ref={register}
            />
            {' '}
            Terapeuta
          </StyledLabel>
          <br />
          <StyledLabel htmlFor="individual">
            <input
              type="checkbox"
              name="individual"
              ref={register}
            />
            {' '}
            MSR
          </StyledLabel>
        </LabelsWrapper>
        <Flexbox middle>
          <Button
            type="submit"
          >
            Buscar
          </Button>
        </Flexbox>
      </Column>
    </FormWrapper>
  )
}

export default Form
