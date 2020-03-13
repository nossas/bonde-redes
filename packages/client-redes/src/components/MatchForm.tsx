import React, { useEffect } from "react";
// import PropTypes from 'prop-types'
import { useLocation } from "react-router-dom";
import {
  Button,
  Flexbox2 as Flexbox,
  FormField,
  Input,
  Text
} from "bonde-styleguide";
import styled from "styled-components";
import { useForm, Controller } from "react-hook-form";
import { useStoreActions } from "easy-peasy";

import { emailValidation } from "../services/utils";
import useAppLogic from "../app-logic";
// import dicioAgent from '../pages/Connect/Table/dicioAgent'

const FormWrapper = styled.form`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;
const StyledField = styled(FormField)`
  padding: 0;
  color: rgba(255, 255, 255, 1);
  position: relative;
  top: 16px;
`;
const StyledFlexbox = styled(Flexbox)`
  width: unset;
`;

const MatchForm = (): React.ReactNode => {
  const { search } = useLocation();
  // const getAvailableVolunteers = useStoreActions(
  //   (actions: { volunteers: { getAvailableVolunteers: void } }) =>
  //     actions.volunteers.getAvailableVolunteers
  // );
  const setForm = useStoreActions(
    (actions: { match: { setForm: ({}) => void } }) => actions.match.setForm
  );

  const { getUserData, tableData } = useAppLogic();

  const {
    handleSubmit,
    // register,
    errors,
    setError,
    control,
    setValue
  } = useForm();

  useEffect(() => {
    // getAvailableVolunteers();
    const email = search.split("=")[1];
    if (email) setValue("email", email);
    // eslint-disable-next-line
  }, [setValue, search])

  const send = (data, e): void => {
    e.preventDefault();

    // buscando dados voluntaria atraves do email
    const user = getUserData({
      user: data.email,
      data: tableData,
      filterBy: "email"
    });
    // const assignee_name = getAgentName(data.agent)

    if (typeof user === "undefined")
      return setError(
        "email",
        "notFound",
        "Não existe uma voluntária com esse e-mail"
      );

    return setForm({
      volunteer: user,
      agent: data.agent
      // assignee_name
    });
  };

  return (
    <FormWrapper onSubmit={handleSubmit(send)}>
      <StyledFlexbox vertical>
        <Controller
          as={
            <StyledField
              label="E-mail da voluntária"
              placeholder="exemplo@email.com"
              type="email"
              inputComponent={Input}
            />
          }
          name="email"
          control={control}
          rules={{
            required: "Esse campo é obrigatório",
            pattern: {
              value: emailValidation(),
              message: "Insira um endereço de e-mail válido"
            }
          }}
        />
        <Text color="#ffffff">{errors.email && errors.email["message"]}</Text>
      </StyledFlexbox>
      <StyledFlexbox vertical>
        {/* <Select
          label="Agente"
          dicio={dicioAgent}
          defaultValue="Escolha uma voluntária"
          name="agent"
          register={register({
            validate: value => value !== 'default' || 'Selecione uma agente',
          })}
        /> */}
        <Text color="#ffffff">{errors.agent && errors.agent["message"]}</Text>
      </StyledFlexbox>
      <Flexbox middle>
        <Button disabled={tableData.length < 1} minWidth="150px" type="submit">
          Buscar
        </Button>
      </Flexbox>
    </FormWrapper>
  );
};

export default MatchForm;