import React from 'react'
// import PropTypes from 'prop-types'
import {
  Button,
  Flexbox2 as Flexbox,
  FormField,
  Input,
} from 'bonde-styleguide'
import styled from 'styled-components'
import { useStateLink } from '@hookstate/core'

import GlobalContext from 'context'
import { getUserData } from 'services/utils'

import Select from './Select'
import dicioAgent from 'pages/Match/Table/dicioAgent'

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
const MatchForm = () => {
  const {
    matchForm: {
      volunteerEmailRef, agentsRef
    },
    matchTable: { submittedParamsRef, volunteerRef },
    table: { tableDataRef }
  } = GlobalContext

  const tableData = useStateLink(tableDataRef)
  const submittedParams = useStateLink(submittedParamsRef)
  const email = useStateLink(volunteerEmailRef)
  const agents = useStateLink(agentsRef)
  const volunteer = useStateLink(volunteerRef)

  const handleSubmit = (e) => {
    e.preventDefault()
    // buscando dados voluntaria atraves do email
    const data = tableData.get()
    const user = getUserData(email.value, data)
    volunteer.set({ ...user })
    submittedParams.set({
      email: email.value,
      agent: agents.value,
    })
  }

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <StyledField
        name="email"
        label="E-mail da voluntária"
        placeholder="exemplo@email.com"
        type="email"
        inputComponent={Input}
        onChange={(e) => email.set(e.target.value)}
        value={email.value}
      />
      <Select
        label="Agente"
        onChange={(e) => agents.set(e.target.value)}
        value={agents.value}
        dicio={dicioAgent}
      />
      <Flexbox middle>
        <Button minWidth="150px" type="submit">
          Buscar
        </Button>
      </Flexbox>
    </FormWrapper>
  )
}

export default MatchForm
