import React, { useState } from 'react';
import { gql } from "apollo-boost";
import styled from 'styled-components';
import { useSession, useMutation } from 'bonde-core-tools';
import { Button, ConnectedForm, InputField, Header, Hint, Validators } from 'bonde-components';

const saveSettingsMutation = gql`
  mutation updateSettings(
    $communityId: bigint
    $settings: json
  ) {
    update_app_settings(
      _set: {
        settings: $settings
      }
      where: {
        id: { _eq: $communityId }
      }
    ) {
      returning {
        id
        settings
      }
    }
  }
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #eee;
  height: 100vh;
`
const Form = styled.form`
  width: 60%;
  margin: 35px 0;
`
  
const WrapForm = styled.div`
  padding: 30px;
  border-radius: 5px;
  background-color: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.04) 2px 1px 14px 11px;
`

const SettingsForm = ({ to }: any) => {
  const { login } = useSession();
  const [error, setError] = useState(undefined);
  const [saveSettings] = useMutation(saveSettingsMutation);
  const { composeValidators, required, min } = Validators;
  // const initialValues = {
  //   input: { ...data.settings }
  // }
  // console.log({data})
  return (
    <Wrapper>
      <Header.h1>Configurações do Módulo</Header.h1>
      <ConnectedForm
        initialValues={{ input: { distance: 5, volunteer_msg: 'bla', individual_msg: 'bla2' }}}
        onSubmit={async (values: any) => {
          try {
            const { data } = await saveSettings({ variables: values })
            login(data.register)
              .then(() => {
                window.location.href = to;
              })
          } catch (err) {
            if (err && err.message && err.message.indexOf('invalid_invitation_code') !== -1) {
              setError(t('form.register.token.invalid'))
              console.log('err', err)
            }
            console.log('RegisterFailed', err)
          }
        }}
      >
        {({ submitting }) => (
          <Form>
            {error && <Hint color='error'>{error}</Hint>}
              <InputField
                name='input.distance'
                label="Distância"
                placeholder="Insira a distância limite entre um match (valor em km)"
                validate={composeValidators(
                  required("Valor não pode ser vazio"),
                  min(1, "Mínimo de 1km")
                )}
              />
              <InputField
                name='input.volunteer_msg'
                label="Voluntária"
                placeholder="Insira uma mensagem de Whatsapp para a voluntária"
                validate={required("Valor não pode ser vazio")}
              />
            <InputField
              name='input.individual_msg'
              label="PSR"
              placeholder="Insira uma mensagem de Whatsapp para a PSR"
            />
            <div>
              <Button type='submit' disabled={submitting}>
                Enviar
              </Button>
            </div>
          </Form>
        )}
      </ConnectedForm>
    </Wrapper>
  );
};

export default SettingsForm;
