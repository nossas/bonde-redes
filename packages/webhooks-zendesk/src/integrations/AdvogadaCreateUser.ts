import * as yup from 'yup'
import { Response } from 'express'
import Base, { GMAPS_ERRORS } from './Base'

export enum CONDITION {
  UNSET = 'unset',
  REPROVADA_REGISTRO_INVÁLIDO = 'reprovada_registro_inválido',
  REPROVADA_DIRETRIZES_DO_MAPA = 'reprovada_diretrizes_do_mapa',
  REPROVADA_ESTUDO_DE_CASO = 'reprovada_estudo_de_caso',
}

class AdvogadaCreateUser extends Base {
  organization = 'ADVOGADA'

  constructor(res: Response) {
    super('AdvogadaCreateUser', 'users/create_or_update', res)
  }

  private setCondition = (condition: [CONDITION], value: CONDITION) => {
    const newCondition = condition
    if (newCondition[0] === CONDITION.UNSET) {
      newCondition[0] = value
    }
  }

  private verificaDiretrizesAtendimento = async (condition: [CONDITION], data: any) => {
    let newData = data
    const verificaCamposDiretrizesAtendimento = yup.object().shape({
      todos_os_atendimentos_rea: yup.string().required(),
      as_voluntarias_do_mapa_do: yup.string().required(),
      o_comprometimento_a_dedic: yup.string().required(),
      o_mapa_do_acolhimento_ent: yup.string().required(),
      para_que_as_mulheres_que: yup.string().required(),
    }).required()

    try {
      await verificaCamposDiretrizesAtendimento.validate(newData, {
        strict: true,
      })
    } catch (e) {
      this.setCondition(condition, CONDITION.REPROVADA_REGISTRO_INVÁLIDO)
    }

    const verificaRespostasDiretrizesAtendimento = yup.object().shape({
      todos_os_atendimentos_rea: yup.string().matches(/aceito/),
      as_voluntarias_do_mapa_do: yup.string().matches(/compreendo/),
      o_comprometimento_a_dedic: yup.string().matches(/sim/),
      o_mapa_do_acolhimento_ent: yup.string().matches(/sim/),
      para_que_as_mulheres_que: yup.string().matches(/sim/),
    }).required()

    if (!await verificaRespostasDiretrizesAtendimento.isValid(newData)) {
      this.setCondition(condition, CONDITION.REPROVADA_DIRETRIZES_DO_MAPA)
    }

    const stripDiretrizesAtendimento = yup.object().shape({
      todos_os_atendimentos_rea: yup.mixed().strip(true),
      as_voluntarias_do_mapa_do: yup.mixed().strip(true),
      o_comprometimento_a_dedic: yup.mixed().strip(true),
      o_mapa_do_acolhimento_ent: yup.mixed().strip(true),
      para_que_as_mulheres_que: yup.mixed().strip(true),
    })

    newData = await stripDiretrizesAtendimento.cast(newData)

    return newData
  }

  private verificaEstudoDeCaso = async (condition: [CONDITION], data: any) => {
    let newData = data
    const verificaCamposEstudoDeCaso = yup.object().shape({
      no_seu_primeiro_atendimen: yup.string().required(),
      para_voce_o_que_e_mais_im: yup.string().required(),
      durante_os_encontros_ana: yup.string().required(),
      durante_os_atendimentos_a: yup.string().required(),
    }).required()

    try {
      await verificaCamposEstudoDeCaso.validate(newData, {
        strict: true,
      })
    } catch (e) {
      this.setCondition(condition, CONDITION.REPROVADA_REGISTRO_INVÁLIDO)
    }

    const verificaRespostaEstudoDeCaso = yup.object().shape({
      no_seu_primeiro_atendimen: yup.string().matches(/A|B/),
      para_voce_o_que_e_mais_im: yup.string().matches(/A|B/),
      durante_os_encontros_ana: yup.string().matches(/A|B/),
      durante_os_atendimentos_a: yup.string().matches(/A|B/),
    }).required()

    if (!await verificaRespostaEstudoDeCaso.isValid(newData)) {
      this.setCondition(condition, CONDITION.REPROVADA_ESTUDO_DE_CASO)
    }

    const stripRespostaEstudoDeCaso = yup.object().shape({
      no_seu_primeiro_atendimen: yup.mixed().strip(true),
      para_voce_o_que_e_mais_im: yup.mixed().strip(true),
      durante_os_encontros_ana: yup.mixed().strip(true),
      durante_os_atendimentos_a: yup.mixed().strip(true),
    }).required()

    newData = await stripRespostaEstudoDeCaso.cast(newData)

    return newData
  }

  /**
   * TODO: adicionar tag cep_incorreto
   */
  private verificaLocalização = async (condition: [CONDITION], data: any) => {
    let newData = data
    const verificaCep = yup.object().shape({
      cep: yup.string().required(),
    }).required()
    try {
      newData = await verificaCep.validate(newData)
    } catch (e) {
      // this.setCondition(condition, CONDITION.REPROVADA_REGISTRO_INVÁLIDO)
    }
    const {
      error, lat: latitude, lng: longitude, address, city, state, tagInvalidCep,
    } = await this.getAddress(newData.cep)

    let tags: string[] | undefined
    if (error === GMAPS_ERRORS.INVALID_INPUT) {
      tags = ['cep-incorreto']
      // this.setCondition(condition, CONDITION.REPROVADA_REGISTRO_INVÁLIDO)
    } else {
      tags = tagInvalidCep ? ['cep-incorreto'] : undefined
    }

    return {
      ...newData,
      latitude,
      longitude,
      address,
      city,
      state,
      tags,
    }
  }

  start = async (data: any, createdAt: string, name: string) => {
    let newData = data
    const condition: [CONDITION] = [CONDITION.UNSET]
    newData = await this.verificaDiretrizesAtendimento(condition, newData)
    newData = await this.verificaEstudoDeCaso(condition, newData)
    const validatedResult = await this.verificaLocalização(condition, newData)

    const { tags } = validatedResult

    try {
      const zendeskValidation = yup
        .object()
        .from('primeiro_nome', 'firstname')
        .from('sobrenome_completo', 'lastname')
        .from('whatsapp_com_ddd', 'whatsapp')
        .from('telefone_de_atendimento_c', 'phone')
        .from('sendo_voluntaria_do_mapa', 'disponibilidade_de_atendimentos')
        .from('quantas_vezes_voce_ja_rec', 'encaminhamentos')
        .from('atualmente_quantas_mulher', 'atendimentos_em_andamento')
        .from('quanto_atendimentos_pelo', 'atendimentos_concluidos')
        .from('insira_seu_numero_de_regi', 'registration_number')
        .from('qual_sua_area_de_atuacao', 'occupation_area')
        .transform((obj) => {
          const {
            email, phone, ...userFields
          } = obj
          let { disponibilidade_de_atendimentos } = obj
          if (disponibilidade_de_atendimentos === '6') {
            disponibilidade_de_atendimentos = '5_ou_mais'
          }
          return {
            name,
            email,
            phone,
            organization_id: this.organizations[this.organization],
            user_fields: {
              ...userFields,
              data_de_inscricao_no_bonde: createdAt,
              ultima_atualizacao_de_dados: new Date().toString(),
              condition: condition[0] === 'unset' ? 'aprovada' : condition[0],
              disponibilidade_de_atendimentos,
            },
          }
        })
        .shape({
          name: yup.string().nullable(),
          email: yup.string().email().required(),
          phone: yup.string().nullable(),
          organization_id: yup.number().nullable(),
          user_fields: yup.object().shape({
            whatsapp: yup.string().nullable(),
            cep: yup
              .string().nullable(),
            cor: yup
              .string().nullable(),
            disponibilidade_de_atendimentos: yup.string().nullable(),
            encaminhamentos: yup.string().nullable(),
            atendimentos_em_andamento: yup.string().nullable(),
            atendimentos_concluidos: yup.string().nullable(),
            registration_number: yup.string().nullable(),
            occupation_area: yup.string().nullable(),
            ultima_atualizacao_de_dados: yup.date().nullable(),
            latitude: yup.number().nullable(),
            longitude: yup.number().nullable(),
            address: yup.string().nullable(),
            city: yup.string().nullable(),
            state: yup.string().lowercase().nullable(),
            condition: yup.string().nullable(),
          }).nullable(),
        })
        .required()

      const zendeskData = await zendeskValidation.validate(validatedResult, {
        stripUnknown: true,
      })

      const dataToBeSent = {
        user: {
          ...zendeskData,
        },
      }
      return {
        tags,
        response: await this.send(dataToBeSent),
      }
    } catch (e) {
      return this.dbg('validation failed', e)
    }
  }
}

export default AdvogadaCreateUser
