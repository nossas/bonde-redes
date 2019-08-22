import Base, { GMAPS_ERRORS } from './Base'
import * as yup from 'yup'
import { Response } from 'express'

export enum CONDITION {
  UNSET = 'unset',
  REPROVADA_REGISTRO_INVÁLIDO = 'reprovada_registro_inválido',
  REPROVADA_DIRETRIZES_DO_MAPA = 'reprovada_diretrizes_do_mapa',
  REPROVADA_ESTUDO_DE_CASO = 'reprovada_estudo_de_caso',
}

class AdvogadaCreateUser extends Base {
  organization = 'ADVOGADA'

  createdAt: string

  constructor (data: any, createdAt: string, res: Response) {
    super('AdvogadaCreateUser', 'users/create_or_update', data, res)
    this.createdAt = createdAt
  }

  private setCondition = (condition: [CONDITION], value: CONDITION) => {
    if (condition[0] === CONDITION.UNSET) {
      condition[0] = value
    }
  }

  private verificaDiretrizesAtendimento = async (condition: [CONDITION], data: any) => {
    const verificaCamposDiretrizesAtendimento = yup.object().shape({
      todos_os_atendimentos_rea: yup.string().required(),
      as_voluntarias_do_mapa_do: yup.string().required(),
      o_comprometimento_a_dedic: yup.string().required(),
      o_mapa_do_acolhimento_ent: yup.string().required(),
      para_que_as_mulheres_que: yup.string().required()
    }).required()

    try {
      await verificaCamposDiretrizesAtendimento.validate(data, {
        strict: true
      })
    } catch (e) {
      this.setCondition(condition, CONDITION.REPROVADA_REGISTRO_INVÁLIDO)
    }

    const verificaRespostasDiretrizesAtendimento = yup.object().shape({
      todos_os_atendimentos_rea: yup.string().matches(/aceito/),
      as_voluntarias_do_mapa_do: yup.string().matches(/compreendo/),
      o_comprometimento_a_dedic: yup.string().matches(/sim/),
      o_mapa_do_acolhimento_ent: yup.string().matches(/sim/),
      para_que_as_mulheres_que: yup.string().matches(/sim/)
    }).required()

    if (!await verificaRespostasDiretrizesAtendimento.isValid(data)) {
      this.setCondition(condition, CONDITION.REPROVADA_DIRETRIZES_DO_MAPA)
    }

    const stripDiretrizesAtendimento = yup.object().shape({
      todos_os_atendimentos_rea: yup.mixed().strip(true),
      as_voluntarias_do_mapa_do: yup.mixed().strip(true),
      o_comprometimento_a_dedic: yup.mixed().strip(true),
      o_mapa_do_acolhimento_ent: yup.mixed().strip(true),
      para_que_as_mulheres_que: yup.mixed().strip(true)
    })

    data = await stripDiretrizesAtendimento.cast(data)

    return data
  }

  private verificaEstudoDeCaso = async (condition: [CONDITION], data: any) => {
    const verificaCamposEstudoDeCaso = yup.object().shape({
      no_seu_primeiro_atendimen: yup.string().required(),
      para_voce_o_que_e_mais_im: yup.string().required(),
      durante_os_encontros_ana: yup.string().required(),
      durante_os_atendimentos_a: yup.string().required()
    }).required()

    try {
      await verificaCamposEstudoDeCaso.validate(data, {
        strict: true
      })
    } catch (e) {
      this.setCondition(condition, CONDITION.REPROVADA_REGISTRO_INVÁLIDO)
    }

    const verificaRespostaEstudoDeCaso = yup.object().shape({
      no_seu_primeiro_atendimen: yup.string().matches(/A|B/),
      para_voce_o_que_e_mais_im: yup.string().matches(/A|B/),
      durante_os_encontros_ana: yup.string().matches(/A|B/),
      durante_os_atendimentos_a: yup.string().matches(/A|B/)
    }).required()

    if (!await verificaRespostaEstudoDeCaso.isValid(data)) {
      this.setCondition(condition, CONDITION.REPROVADA_ESTUDO_DE_CASO)
    }

    const stripRespostaEstudoDeCaso = yup.object().shape({
      no_seu_primeiro_atendimen: yup.mixed().strip(true),
      para_voce_o_que_e_mais_im: yup.mixed().strip(true),
      durante_os_encontros_ana: yup.mixed().strip(true),
      durante_os_atendimentos_a: yup.mixed().strip(true)
    }).required()

    data = await stripRespostaEstudoDeCaso.cast(data)

    return data
  }

  private verificaLocalização = async (condition: [CONDITION], data: any) => {
    const verificaCep = yup.object().shape({
      cep: yup.string().required()
    }).required()
    try {
      data = await verificaCep.validate(data)
    } catch (e) {
      this.setCondition(condition, CONDITION.REPROVADA_REGISTRO_INVÁLIDO)
    }
    const { error, lat: latitude, lng: longitude, address, city, state } = await this.getAddress(data.cep)
    if (error === GMAPS_ERRORS.INVALID_INPUT) {
      this.setCondition(condition, CONDITION.REPROVADA_REGISTRO_INVÁLIDO)
    }

    return {
      ...data,
      latitude,
      longitude,
      address,
      city,
      state
    }
  }

  start = async () => {
    let data = this.data
    const condition: [CONDITION] = [CONDITION.UNSET]
    data = await this.verificaDiretrizesAtendimento(condition, data)
    data = await this.verificaEstudoDeCaso(condition, data)
    data = await this.verificaLocalização(condition, data)

    try {
      const zendeskValidation = yup
        .object()
        .from('primeiro_nome', 'firstname')
        .from('sobrenome_completo', 'lastname')
        .from('whatsapp_com_ddd', 'whatsapp')
        .from('sendo_voluntaria_do_mapa', 'disponibilidade_de_atendimentos')
        .from('quantas_vezes_voce_ja_rec', 'encaminhamentos')
        .from('atualmente_quantas_mulher', 'atendimentos_em_andamento')
        .from('quanto_atendimentos_pelo', 'atendimentos_concluidos')
        .from('insira_seu_numero_de_regi', 'registration_number')
        .from('qual_sua_area_de_atuacao', 'occupation_area')
        .transform((obj) => {
          const { email, ...userFields } = obj
          return {
            name: `${obj.firstname} ${obj.lastname}`,
            email,
            phone: obj.whatsapp,
            organization_id: this.organizations[this.organization],
            user_fields: {
              ...userFields,
              data_de_inscricao_no_bonde: this.createdAt,
              ultima_atualizacao_de_dados: new Date().toString(),
              condition: condition[0]
            }
          }
        })
        .shape({
          name: yup.string().required(),
          email: yup.string().email().required(),
          phone: yup.string().required(),
          organization_id: yup.number().required(),
          user_fields: yup.object().shape({
            whatsapp: yup.string().required(),
            cep: yup
              .string()
              .required(),
            cor: yup
              .string()
              .required(),
            disponibilidade_de_atendimentos: yup.string().required(),
            encaminhamentos: yup.string().required(),
            atendimentos_em_andamento: yup.string().required(),
            atendimentos_concluidos: yup.string().required(),
            registration_number: yup.string().required(),
            occupation_area: yup.string().required(),
            ultima_atualizacao_de_dados: yup.date().required(),
            latitude: yup.number(),
            longitude: yup.number(),
            address: yup.string(),
            city: yup.string(),
            state: yup.string().lowercase(),
            condition: yup.string().required()
          })
        })
        .required()

      const zendeskData = await zendeskValidation.validate(data, {
        stripUnknown: true
      })

      this.dbg(zendeskData)
      const dataToBeSent = {
        user: {
          ...zendeskData
        }
      }
      return this.send(dataToBeSent)
    } catch (e) {
      this.dbg('validation failed', e)
    }
  }
}

export default AdvogadaCreateUser
