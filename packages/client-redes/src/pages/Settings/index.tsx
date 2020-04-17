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
import FetchCommunityGroups from "../../graphql/FetchCommunityGroups";

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
    <FetchCommunityGroups>
      {(data): React.ReactNode => {
        const { volunteer, individual } = data.reduce((obj, item) => {
          return {
            ...obj,
            [item.is_volunteer ? "volunteer" : "individual"]: item
          };
        }, {});
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
                      {data.map((group, i) => (
                        <TextareaField
                          name={
                            group.is_volunteer
                              ? "input.volunteer_msg"
                              : "input.individual_msg"
                          }
                          label={group.name}
                          placeholder={`Insira uma mensagem de Whatsapp para o grupo de ${group.name}`}
                          validate={required("Valor não pode ser vazio")}
                          key={`textarea-groups-${i}`}
                        />
                      ))}
                    </WrapTextarea>
                    <WrapText>
                      <Text>
                        *VFIRST_NAME: Primeiro nome da {volunteer.name}
                      </Text>
                      <Text>
                        *IFIRST_NAME: Primeiro nome da {individual.name}
                      </Text>
                      <Text>*VEMAIL: Email da {volunteer.name}</Text>
                      <Text>*IEMAIL: Email da {individual.name}</Text>
                      <Text>*VWHATSAPP: Whatsapp da {volunteer.name}</Text>
                      <Text>*IWHATSAPP: Whatsapp da {individual.name}</Text>
                      <Text>
                        *VREGISTER_OCCUPATION: Nº de registro da{" "}
                        {volunteer.name}
                      </Text>
                      <Text>*AGENT: Pessoa que realiza a relação</Text>
                    </WrapText>
                  </WrapForm>
                </>
              )}
            </ConnectedForm>
          </SettingsWrapper>
        );
      }}
    </FetchCommunityGroups>
  );
};

export default SettingsForm;
