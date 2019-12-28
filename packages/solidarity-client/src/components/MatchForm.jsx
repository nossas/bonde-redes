import React from 'react'
// import PropTypes from 'prop-types'
import {
  Button,
  Flexbox2 as Flexbox,
  FormField,
  Input,
  Text
} from 'bonde-styleguide'
import styled from 'styled-components'
import { useStateLink } from '@hookstate/core'
import useForm from 'react-hook-form';
import { RHFInput } from 'react-hook-form-input';
import { useStoreActions } from 'easy-peasy';

import GlobalContext from '../context'
import { getUserData } from '../services/utils'

import Select from './Select'
import dicioAgent from '../pages/Match/Table/dicioAgent'

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
const StyledFlexbox = styled(Flexbox)`
  width: unset;
`

const MatchForm = () => {
  const {
    table: { tableDataRef },
  } = GlobalContext

  const tableData = useStateLink(tableDataRef)
  const setVolunteer = useStoreActions(actions => actions.volunteer.setVolunteer);
  const setAgent = useStoreActions(actions => actions.agent.setAgent)

  const send = ({ email, agent }) => {
    // buscando dados voluntaria atraves do email
    const data = tableData.get()
    const user = getUserData({
      user: email,
      data,
      filterBy: "email"
    })
    // TODO: Tratar erro de nao achar uma usuaria com esse email
    setVolunteer(user)
    setAgent(agent)
  }

  const { handleSubmit, register, setValue, errors, getValues } = useForm();

  return (
    <FormWrapper onSubmit={handleSubmit(send)}>
      <StyledFlexbox vertical>
        <RHFInput
          as={
            <StyledField
              label="E-mail da voluntária"
              placeholder="exemplo@email.com"
              type="email"
              inputComponent={Input}
            />
          }
          name="email"
          register={register}
          setValue={setValue}
          rules={{ required: "Este campo é obrigatório" }}
        />
        <Text color="#ffffff">{errors.email && errors.email.message}</Text>
      </StyledFlexbox>
      <StyledFlexbox vertical>
        <RHFInput
          as={
            <Select
              label="Agente"
              dicio={dicioAgent}
              defaultValue="Escolha uma voluntária"
            />
          }
          name="agent"
          register={register}
          setValue={setValue}
          rules={{ required: "Este campo é obrigatório" }}
        />
        <Text color="#ffffff">{errors.agent && errors.agent.message}</Text>
      </StyledFlexbox>
      <Flexbox middle>
        <Button minWidth="150px" type="submit">
          Buscar
        </Button>
      </Flexbox>
    </FormWrapper>
  )
}

export default MatchForm
