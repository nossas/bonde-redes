import ZendeskBase from "./ZendeskBase";

interface RequesterFields {
  atendimentos_em_andamento_calculado_?: number;
  atendimentos_concludos_calculado_?: number;
  encaminhamentos_realizados_calculado_?: number;
  latitude?: string | null;
  longitude?: string | null;
  address?: string | null;
}

const updateRequesterFields = (user_id: number, fields: RequesterFields) =>
  ZendeskBase.put(`users/${user_id}`, {
    user: {
      user_fields: {
        ...fields
      }
    }
  });

export default updateRequesterFields;
