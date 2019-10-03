import Base from './Base'

interface RequesterFields {
  atendimentos_em_andamento_calculado_: number
  atendimentos_concludos_calculado_: number
  encaminhamentos_realizados_calculado_: number
}

const updateRequesterFields = (user_id: number, fields: RequesterFields) => {
  return Base.put(`users/${user_id}`, {
    user: {
      user_fields: {
        ...fields
      }
    }
  })
}

export default updateRequesterFields
