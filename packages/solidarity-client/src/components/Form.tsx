import React from 'react'
// import PropTypes from 'prop-types'
import {
  Button,
  Flexbox2 as Flexbox,
  FormField,
  Input,
} from 'bonde-styleguide'
import styled from 'styled-components'
import GlobalContext from 'context'
import { useStateLink } from '@hookstate/core'
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
    form: {
      distanceRef, geolocationRef, therapistCheckboxRef, lawyerCheckboxRef, individualCheckboxRef,
    },
    table: { submittedParamsRef }
  } = GlobalContext

  const submittedParams = useStateLink(submittedParamsRef)
  const geolocation = useStateLink(geolocationRef)
  const distance = useStateLink(distanceRef)
  const individualCheckbox = useStateLink(individualCheckboxRef)
  const lawyerCheckbox = useStateLink(lawyerCheckboxRef)
  const therapistCheckbox = useStateLink(therapistCheckboxRef)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    submittedParams.set({
      ...geolocation.value!,
      distance: distance.value,
      individual: individualCheckbox.value,
      lawyer: lawyerCheckbox.value,
      therapist: therapistCheckbox.value,
    })
  }

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <MapsSearchInput
        name="address"
        label="Endereço"
        placeholder="Digite o endereço"
        onChangeLocation={(e: any) => geolocation.set(e)}
        value={geolocation.value}
      />
      <StyledField
        name="distance"
        label="Distância (km)"
        placeholder="Informe o raio de busca"
        type="number"
        inputComponent={Input}
        onChange={(e: any) => distance.set(Number(e.target.value))}
        value={distance.value}
      />
      <Column>
        <LabelsWrapper>
          <StyledLabel htmlFor="lawyer">
            <input
              type="checkbox"
              id="lawyer"
              onChange={() => lawyerCheckbox.set((p) => !p)}
              checked={lawyerCheckbox.value}
            />
            {' '}
            Advogada
          </StyledLabel>
          <br />
          <StyledLabel htmlFor="therapist">
            <input
              type="checkbox"
              id="therapist"
              onChange={() => therapistCheckbox.set((p) => !p)}
              checked={therapistCheckbox.value}
            />
            {' '}
            Terapeuta
          </StyledLabel>
          <br />
          <StyledLabel htmlFor="individual">
            <input
              type="checkbox"
              id="individual"
              onChange={() => individualCheckbox.set((p) => !p)}
              checked={individualCheckbox.value}
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
