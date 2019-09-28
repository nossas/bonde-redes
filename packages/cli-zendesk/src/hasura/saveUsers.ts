import User from "../interfaces/User"
import axios from 'axios'
import dbg from "./dbg"
import {stringify} from "../stringify"

const query = (users: User[]) => `
  mutation {
    insert_solidarity_users (
      objects: ${stringify(users)}
      on_conflict: {
        constraint: solidarity_users_pkey
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
          condition
          cor
          created_at
          custom_role_id
          data_de_inscricao_no_bonde
          default_group_id
          details
          disponibilidade_de_atendimentos
          email
          encaminhamentos
          encaminhamentos_realizados_calculado_
          external_id
          iana_time_zone
          id
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
          user_id
          verified
          whatsapp
        ]
      }
    ) {
      affected_rows
    }
  }
`

const saveUsers = async (users: User[]) => {
  const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env
  const response = await axios.post(HASURA_API_URL, {
    query: query(users)
  }, {
    headers: {
      'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET
    }
  })

  response.data.errors && dbg(response.data.errors)

  return response
}

export default saveUsers
