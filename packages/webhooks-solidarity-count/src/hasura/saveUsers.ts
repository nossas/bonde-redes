import User from "../interfaces/User";
import dbg from "./dbg";
import generateRequestVariables from "./generateRequestVariables";
import HasuraBase from "./HasuraBase";
import isError, { HasuraResponse } from "./isError";

const generateVariablesIndex = (index: number) => `
$active_${index}: Boolean
$address_${index}: String
$alias_${index}: String
$atendimentos_concludos_calculado__${index}: bigint
$atendimentos_concluidos_${index}: bigint
$atendimentos_em_andamento_${index}: bigint
$atendimentos_em_andamento_calculado__${index}: bigint
$cep_${index}: String
$chat_only_${index}: Boolean
$city_${index}: String
$community_id_${index}: Int
$condition_${index}: String
$cor_${index}: String
$disponibilidade_de_atendimentos_${index}: String
$created_at_${index}: timestamp
$custom_role_id_${index}: bigint
$data_de_inscricao_no_bonde_${index}: timestamp
$default_group_id_${index}: bigint
$details_${index}: String
$email_${index}: String
$encaminhamentos_${index}: bigint
$encaminhamentos_realizados_calculado__${index}: bigint
$external_id_${index}: bigint
$iana_time_zone_${index}: String
$last_login_at_${index}: timestamp
$latitude_${index}: String
$locale_${index}: String
$locale_id_${index}: bigint
$longitude_${index}: String
$moderator_${index}: Boolean
$name_${index}: String
$notes_${index}: String
$occupation_area_${index}: String
$only_private_comments_${index}: Boolean
$organization_id_${index}: bigint
$phone_${index}: String
$photo_${index}: jsonb
$registration_number_${index}: String
$report_csv_${index}: Boolean
$restricted_agent_${index}: Boolean
$role_${index}: String
$role_type_${index}: bigint
$shared_${index}: Boolean
$shared_agent_${index}: Boolean
$shared_phone_number_${index}: Boolean
$signature_${index}: String
$state_${index}: String
$suspended_${index}: Boolean
$tags_${index}: jsonb
$ticket_restriction_${index}: String
$time_zone_${index}: String
$tipo_de_acolhimento_${index}: String
$two_factor_auth_enabled_${index}: Boolean
$ultima_atualizacao_de_dados_${index}: timestamp
$updated_at_${index}: timestamp
$url_${index}: String
$user_fields_${index}: jsonb
$user_id_${index}: bigint
$verified_${index}: Boolean
$whatsapp_${index}: String
$permanently_deleted_${index}: Boolean
`;

const generateObjectsIndex = (index: number) => `
active: $active_${index}
address: $address_${index}
alias: $alias_${index}
atendimentos_concludos_calculado_: $atendimentos_concludos_calculado__${index}
atendimentos_concluidos: $atendimentos_concluidos_${index}
atendimentos_em_andamento: $atendimentos_em_andamento_${index}
atendimentos_em_andamento_calculado_: $atendimentos_em_andamento_calculado__${index}
cep: $cep_${index}
chat_only: $chat_only_${index}
city: $city_${index}
community_id: $community_id_${index}
condition: $condition_${index}
cor: $cor_${index}
disponibilidade_de_atendimentos: $disponibilidade_de_atendimentos_${index}
created_at: $created_at_${index}
custom_role_id: $custom_role_id_${index}
data_de_inscricao_no_bonde: $data_de_inscricao_no_bonde_${index}
default_group_id: $default_group_id_${index}
details: $details_${index}
email: $email_${index}
encaminhamentos: $encaminhamentos_${index}
encaminhamentos_realizados_calculado_: $encaminhamentos_realizados_calculado__${index}
external_id: $external_id_${index}
iana_time_zone: $iana_time_zone_${index}
last_login_at: $last_login_at_${index}
latitude: $latitude_${index}
locale: $locale_${index}
locale_id: $locale_id_${index}
longitude: $longitude_${index}
moderator: $moderator_${index}
name: $name_${index}
notes: $notes_${index}
occupation_area: $occupation_area_${index}
only_private_comments: $only_private_comments_${index}
organization_id: $organization_id_${index}
phone: $phone_${index}
photo: $photo_${index}
registration_number: $registration_number_${index}
report_csv: $report_csv_${index}
restricted_agent: $restricted_agent_${index}
role: $role_${index}
role_type: $role_type_${index}
shared: $shared_${index}
shared_agent: $shared_agent_${index}
shared_phone_number: $shared_phone_number_${index}
signature: $signature_${index}
state: $state_${index}
suspended: $suspended_${index}
tags: $tags_${index}
ticket_restriction: $ticket_restriction_${index}
time_zone: $time_zone_${index}
tipo_de_acolhimento: $tipo_de_acolhimento_${index}
two_factor_auth_enabled: $two_factor_auth_enabled_${index}
ultima_atualizacao_de_dados: $ultima_atualizacao_de_dados_${index}
updated_at: $updated_at_${index}
url: $url_${index}
user_fields: $user_fields_${index}
user_id: $user_id_${index}
verified: $verified_${index}
whatsapp: $whatsapp_${index}
permanently_deleted: $permanently_deleted_${index}
`;

const generateVariables = (tickets: User[]) =>
  tickets.map((_, index) => generateVariablesIndex(index)).flat();

const generateObjects = (tickets: User[]) =>
  `[${tickets
    .map((_, index) => `{${generateObjectsIndex(index)}}`)
    .join(",")}]`;

const createQuery = (users: User[]) => `mutation (${generateVariables(users)}) {
  insert_solidarity_users (objects: ${generateObjects(users)}, on_conflict: {
    constraint: solidarity_users_user_id_key
    update_columns: [
      active
      address
      alias
      atendimentos_concludos_calculado_
      atendimentos_concluidos
      atendimentos_em_andamento
      atendimentos_em_andamento_calculado_
      cep
      chat_only
      city
      community_id
      condition
      cor
      disponibilidade_de_atendimentos
      created_at
      custom_role_id
      data_de_inscricao_no_bonde
      default_group_id
      details
      email
      encaminhamentos
      encaminhamentos_realizados_calculado_
      external_id
      iana_time_zone
      last_login_at
      latitude
      locale
      locale_id
      longitude
      moderator
      name
      notes
      occupation_area
      only_private_comments
      organization_id
      phone
      photo
      registration_number
      report_csv
      restricted_agent
      role
      role_type
      shared
      shared_agent
      shared_phone_number
      signature
      state
      suspended
      tags
      ticket_restriction
      time_zone
      tipo_de_acolhimento
      two_factor_auth_enabled
      ultima_atualizacao_de_dados
      updated_at
      url
      user_fields
      verified
      whatsapp
      permanently_deleted
    ]
  }) {
    affected_rows
  }
}
`;

const log = dbg.extend("saveUsers");

interface Response {
  affected_rows: number;
}

const saveUsers = async (users: User[]) => {
  try {
    const query = createQuery(users);
    const variables = generateRequestVariables(users);
    const response = await HasuraBase<
      HasuraResponse<"insert_solidarity_users", Response>
    >(query, variables);

    if (isError(response.data)) {
      return log(response.data.errors);
    }

    return response.data.data.insert_solidarity_users.affected_rows === 1;
  } catch (e) {
    return log(e);
  }
};

export default saveUsers;
