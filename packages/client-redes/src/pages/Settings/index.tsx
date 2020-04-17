import React from "react";
import { useHistory } from "react-router-dom";
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
  TextareaField,
  Link
} from "bonde-components";
import { Card } from "bonde-styleguide";
import { useSettings } from "../../services/SettingsProvider";
import { SettingsWrapper, HeaderWrap, WrapTextarea, WrapText } from "./styles";
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
  const { goBack } = useHistory();
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
                    <Link onClick={goBack}>{"< voltar"}</Link>
                    <Button type="submit" disabled={submitting}>
                      Salvar alterações
                    </Button>
                  </HeaderWrap>
                  <Card
                    rounded={5}
                    padding={{ x: 40, y: 40 }}
                    margin={{ bottom: 10 }}
                  >
                    <div style={{ "margin-bottom": 20 }}>
                      <Header.h2>Match</Header.h2>
                    </div>
                    {error && <Hint color="error">{error}</Hint>}
                    <InputField
                      name="input.distance"
                      label="Distância máxima para o match (em km)"
                      validate={composeValidators(
                        required("Valor não pode ser vazio"),
                        min(1, "Mínimo de 1km")
                      )}
                      type="number"
                    />
                    <WrapTextarea>
                      {data.map((group, i) => (
                        <TextareaField
                          name={
                            group.is_volunteer
                              ? "input.volunteer_msg"
                              : "input.individual_msg"
                          }
                          label={`Msg de whatsapp para ${group.name}`}
                          validate={required("Valor não pode ser vazio")}
                          key={`textarea-groups-${i}`}
                        />
                      ))}
                    </WrapTextarea>
                    <WrapText>
                      <div>
                        <Text>
                          *VFIRST_NAME: Primeiro nome da {volunteer.name}
                        </Text>
                        <Text>
                          *IFIRST_NAME: Primeiro nome da {individual.name}
                        </Text>
                        <Text>*VEMAIL: Email da {volunteer.name}</Text>
                        <Text>*IEMAIL: Email da {individual.name}</Text>
                      </div>
                      <div>
                        <Text>*VWHATSAPP: Whatsapp da {volunteer.name}</Text>
                        <Text>*IWHATSAPP: Whatsapp da {individual.name}</Text>
                        <Text>
                          *VREGISTER_OCCUPATION: Nº de registro da{" "}
                          {volunteer.name}
                        </Text>
                        <Text>*AGENT: Pessoa que realiza a relação</Text>
                      </div>
                    </WrapText>
                  </Card>
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
