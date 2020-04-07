import React, { useState } from 'react';
import { gql } from "apollo-boost";
import { useMutation, useSession } from 'bonde-core-tools';
import { 
  Button, 
  ConnectedForm, 
  InputField, 
  Hint, 
  Validators, 
  Header,
  Text
} from 'bonde-components';
import { useSettings } from '../../services/SettingsContext'
import { WrapForm, SettingsWrapper, BottomWrap } from './styles'

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
        community_id: { _eq: $communityId }
      }
    ) {
      returning {
        id
        settings
      }
    }
  }
`

const SettingsForm = () => {
  const [error, setError] = useState(undefined);
  const [saveSettings] = useMutation(saveSettingsMutation);
  const { composeValidators, required, min } = Validators;
  const { settings } = useSettings()
  const { community } = useSession()
  const initialValues = { input: { ...settings } } 

  return (
    <SettingsWrapper>
      <Header.h3>Configurações do Módulo</Header.h3>
      <ConnectedForm
        initialValues={initialValues}
        onSubmit={async (values: any) => {
          try {
            const variables = {
              communityId: (community && community.id) || 0,
              settings: values.input
            }
            await saveSettings({ variables })
          } catch (err) {
            if (err && err.message) {
              setError(err.message)
              console.log('err', err)
            }
          }
        }}
      >
        {({ submitting }) => (
          <WrapForm>
            {error && <Hint color='error'>{error}</Hint>}
              <InputField
                name='input.distance'
                label="Distância"
                placeholder="Insira a distância limite entre um match (valor em km)"
                validate={composeValidators(
                  required("Valor não pode ser vazio"),
                  min(1, "Mínimo de 1km")
                )}
                type="number"
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
              validate={required("Valor não pode ser vazio")}
            />
            <BottomWrap>
              <Button type='submit' disabled={submitting}>
                Enviar
              </Button>
              <div>
                <Text>*VNAME: Nome da voluntária</Text>
                <Text>*PNAME: Nome da PSR</Text>
                <Text>*VEMAIL: Email da voluntária</Text>
                <Text>*AGENT: Nome da agente</Text>
              </div>
            </BottomWrap>
          </WrapForm>
        )}
      </ConnectedForm>
    </SettingsWrapper>
  );
};

export default SettingsForm;
