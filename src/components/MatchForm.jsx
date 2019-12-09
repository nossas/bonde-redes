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
      volunteerEmailRef, zendeskAgentRef, volunteerRef
    },
    matchTable: { tableDataRef },
  } = GlobalContext

  const tableData = useStateLink(tableDataRef)
  const email = useStateLink(volunteerEmailRef)
  const zendeskAgent = useStateLink(zendeskAgentRef)
  const volunteer = useStateLink(volunteerRef)

  const handleSubmit = (e) => {
    e.preventDefault()
    // buscando dados voluntaria atraves do email
    const data = tableData.get()
    const user = getUserData(email.value, data, "email")
    volunteer.set({ ...user })
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
        onChange={(e) => zendeskAgent.set(e.target.value)}
        value={zendeskAgent.value}
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
