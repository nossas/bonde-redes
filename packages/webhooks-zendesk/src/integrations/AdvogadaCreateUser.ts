import Base from './Base'
import * as yup from 'yup'

enum FALHAS {
  DIRETRIZ_ATENDIMENTO = 'DIRETRIZ_ATENDIMENTO',
  ESTUDO_DE_CASO = 'ESTUDO_DE_CASO'
}

class AdvogadaCreateUser extends Base {
  organization = 'ADVOGADA'
  created_at: string
  constructor(data: any, created_at: string) {
    super('AdvogadaCreateUser', 'users', data)
    this.created_at = created_at
  }

  start = async () => {
    try {
      const { lat: latitude, lng: longitude, address, city, state } = await this.getAddress(this.data.cep)
      const validation = yup
        .object()
        .from('primeiro_nome', 'firstname')
        .from('sobrenome_completo', 'lastname')
        .from('whatsapp_com_ddd', 'whatsapp')
        .from('cor', 'color')
        .from('sendo_voluntaria_do_mapa', 'disponibilidade_de_atendimentos')
        .from('quantas_vezes_voce_ja_rec', 'encaminhamentos')
        .from('atualmente_quantas_mulher', 'atendimentos_em_andamento')
        .from('quanto_atendimentos_pelo', 'atendimentos_concluidos')
        .from('insira_seu_numero_de_regi', 'registration_number')
        .from('qual_sua_area_de_atuacao', 'occupation_area')
        .transform((obj) => {
          return {
            ...obj,
            phone: obj.whatsapp,
            organization_id: this.organizations[this.organization],
            'data_de_inscricao_no_bonde': this.created_at,
            'ultima_atualizacao_de_dados': new Date().toString(),
            latitude,
            longitude,
            address,
            city,
            state
          }
        })
        .shape({
          'firstname': yup.string().required(),
          'lastname': yup.string().required(),
          'email': yup.string().email().required(),
          'whatsapp': yup.string().required(),
          'phone': yup.string().required(),
          'cep': yup
            .string()
            .required()
            .test('cep length', 'not a valid cep', (i: string) => i.length === 8),
          'color': yup
            .string()
            .required(),
          'disponibilidade_de_atendimentos': yup.string().required(),
          'encaminhamentos': yup.string().required(),
          'atendimentos_em_andamento': yup.string().required(),
          'atendimentos_concluidos': yup.string().required(),
          'organization_id': yup.number().required(),
          'registration_number': yup.string().required(),
          'occupation_area': yup.string().required(),
          'ultima_atualizacao_de_dados': yup.date().required(),
          'latitude': yup.number().required(),
          'longitude': yup.number().required(),
          'address': yup.string().required(),
          'city': yup.string().required(),
          'state': yup.string().required(),

          'todos_os_atendimentos_rea': yup.string().required().matches(/aceito/, FALHAS.DIRETRIZ_ATENDIMENTO),
          'as_voluntarias_do_mapa_do': yup.string().required().matches(/compreendo/, FALHAS.DIRETRIZ_ATENDIMENTO),
          'o_comprometimento_a_dedic': yup.string().required().matches(/sim/, FALHAS.DIRETRIZ_ATENDIMENTO),
          'o_mapa_do_acolhimento_ent': yup.string().required().matches(/sim/, FALHAS.DIRETRIZ_ATENDIMENTO),
          'para_que_as_mulheres_que': yup.string().required().matches(/sim/, FALHAS.DIRETRIZ_ATENDIMENTO),
        })
        .required()
      const zendeskData = await validation.validate(this.data, {
        stripUnknown: true,
      })

      // Striping 
      this.dbg(validatedData)
      const dataToBeSent = {
        user: {
          ...validatedData
        }
      }
      return this.send(dataToBeSent)
    } catch (e) {
      this.dbg('validation failed', e)
    }
  }
}

export default AdvogadaCreateUser
