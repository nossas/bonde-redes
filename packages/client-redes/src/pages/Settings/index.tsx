import React from "react";
import { gql } from "apollo-boost";
import { toast } from "react-toastify";
import { useMutation, useSession } from "bonde-core-tools";
import {
  Button,
  ConnectedForm,
  InputField,
  Hint,
  Validators,
  Header,
  Text,
  TextareaField
} from "bonde-components";
import { useSettings } from "../../services/SettingsProvider";
import {
  WrapForm,
  SettingsWrapper,
  HeaderWrap,
  WrapTextarea,
  WrapText
} from "./styles";
import { Form, Settings, SettingsVars } from "../../types";
import { settingsSaved } from "../../services/utils/notifications";

const saveSettingsMutation = gql`
  mutation updateSettings($communityId: bigint, $settings: json) {
    update_community_settings(
      _set: { settings: $settings }
      where: { community_id: { _eq: $communityId } }
    ) {
      returning {
        id
        settings
      }
    }
  }
`;

type SettingsData = {
  update_community_settings: {
    returning: Settings[];
  };
};

const SettingsForm = () => {
  const [saveSettings, { error }] = useMutation<SettingsData, SettingsVars>(
    saveSettingsMutation
  );
  const { composeValidators, required, min } = Validators;
  const { settings } = useSettings();
  const { community } = useSession();
  const initialValues = { input: { ...settings } };

  const onSubmit = async (values: Form) => {
    try {
      const variables = {
        communityId: (community && community.id) || 0,
        settings: values.input
      };
      await saveSettings({ variables });
      if (!error) {
        console.log(settingsSaved());
        toast.success(settingsSaved().message, {
          autoClose: settingsSaved().dismissAfter,
          hideProgressBar: settingsSaved().progress,
          closeButton: settingsSaved().closeButton
        });
      }
    } catch (err) {
      if (err && err.message) {
        console.log("err", err);
      }
    }
  };

  return (
    <SettingsWrapper>
      <ConnectedForm initialValues={initialValues} onSubmit={onSubmit}>
        {({ submitting }) => (
          <>
            <HeaderWrap>
              <Header.h3>Configurações do Módulo</Header.h3>
              <Button type="submit" disabled={submitting}>
                Salvar alterações
              </Button>
            </HeaderWrap>
            <WrapForm>
              {error && <Hint color="error">{error}</Hint>}
              <InputField
                name="input.distance"
                label="Distância"
                placeholder="Insira a distância limite entre um match (valor em km)"
                validate={composeValidators(
                  required("Valor não pode ser vazio"),
                  min(1, "Mínimo de 1km")
                )}
                type="number"
              />
              <div style={{ marginBottom: "15px" }}>
                <Header.h4>Mensagens de Whatsapp</Header.h4>
              </div>
              <WrapTextarea>
                <TextareaField
                  name="input.volunteer_msg"
                  label="Voluntária"
                  placeholder="Insira uma mensagem de Whatsapp para a voluntária"
                  validate={required("Valor não pode ser vazio")}
                />
                <TextareaField
                  name="input.individual_msg"
                  label="PSR"
                  placeholder="Insira uma mensagem de Whatsapp para a PSR"
                  validate={required("Valor não pode ser vazio")}
                />
              </WrapTextarea>
              <WrapText>
                <Text>*VFIRST_NAME: Primeiro nome da voluntária</Text>
                <Text>*PFIRST_NAME: Primeiro nome da PSR</Text>
                <Text>*VEMAIL: Email da voluntária</Text>
                <Text>*PEMAIL: Email da PSR</Text>
                <Text>*VWHATSAPP: Whatsapp da voluntária</Text>
                <Text>*PWHATSAPP: Whatsapp da PSR</Text>
                <Text>*VREGISTER_OCCUPATION: Nº de registro da voluntária</Text>
                <Text>*AGENT: Nome da agente</Text>
              </WrapText>
            </WrapForm>
          </>
        )}
      </ConnectedForm>
    </SettingsWrapper>
  );
};

export default SettingsForm;
