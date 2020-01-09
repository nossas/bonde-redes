import Validator from 'validator'
import isEmpty from './is-empty'

const checkField = input => !isEmpty(input) ? String(input) : ''

const hasError = errors => {
  const check = Object.values(errors).filter(i => i !== undefined)
  console.log(check, check.length)
  return check.length > 0
}

interface Errors {
  agent: string | undefined
  individual_name: string | undefined
  individual_ticket_id: string | undefined
  volunteer_name: string | undefined
  volunteer_user_id: string | undefined
  volunteer_registry: string | undefined
  volunteer_phone: string | undefined
  volunteer_organization_id: string | undefined
}

const validate = data => {
  let errors: Errors = {
    agent: undefined,
    individual_name: undefined,
    individual_ticket_id: undefined,
    volunteer_name: undefined,
    volunteer_user_id: undefined,
    volunteer_registry: undefined,
    volunteer_phone: undefined,
    volunteer_organization_id: undefined
  }

  const zendeskOrganizations = JSON.parse(process.env.REACT_APP_ZENDESK_ORGANIZATIONS || '{}')

  const checkedData = {
    ...data,
    agent: checkField(data.agent),
    individual_name: checkField(data.individual_name),
    individual_ticket_id: checkField(data.individual_ticket_id),
    volunteer_name: checkField(data.volunteer_name),
    volunteer_user_id: checkField(data.volunteer_user_id),
    volunteer_registry: checkField(data.volunteer_registry),
    volunteer_phone: checkField(data.volunteer_phone),
    volunteer_organization_id: checkField(data.volunteer_organization_id)
  }

  // Agent
  if (!Validator.isNumeric(checkedData.agent, { no_symbols: true })) {
    errors = { ...errors, agent: 'ID do agente deve conter apenas números' }
  }
  if (Validator.isEmpty(checkedData.agent)) {
    errors = { ...errors, agent: 'Selecione um agente' }
  }

  // Nome da MSR
  if (Validator.isEmpty(checkedData.individual_name)) {
    errors = { ...errors, individual_name: 'O nome da MSR é obrigatório' }
  }

  // Ticket ID da MSR
  if (!Validator.isNumeric(checkedData.individual_ticket_id, { no_symbols: true })) {
    errors = { ...errors, individual_ticket_id: 'O nome da MSR é obrigatório' }
  }
  if (Validator.isEmpty(checkedData.individual_ticket_id)) {
    errors = { ...errors, individual_ticket_id: 'Selecione uma MSR' }
  }

  // Nome da Voluntária
  if (Validator.isEmpty(checkedData.volunteer_name)) {
    errors = { ...errors, volunteer_name: 'O nome da voluntária é obrigatório' }
  }

  // User ID da Voluntária
  if (!Validator.isNumeric(checkedData.volunteer_user_id, { no_symbols: true })) {
    errors = { ...errors, volunteer_user_id: 'user_id da voluntária deve conter apenas números' }
  }
  if (Validator.isEmpty(checkedData.volunteer_user_id)) {
    errors = { ...errors, volunteer_user_id: 'Selecione uma Voluntária' }
  }

  // Registro da Voluntária
  if (Validator.isEmpty(checkedData.volunteer_registry)) {
    errors = { ...errors, volunteer_registry: 'A voluntária precisa ter um número de registro' }
  }

  // Telefone da Voluntária
  if (Validator.isEmpty(checkedData.volunteer_phone)) {
    errors = { ...errors, volunteer_phone: 'A voluntária precisa ter um número de telefone' }
  }
  if (!Validator.isNumeric(checkedData.volunteer_phone)) {
    errors = { ...errors, volunteer_phone: 'Número da voluntária não é válido' }
  }

  // Organização da Voluntária
  if (Validator.isEmpty(checkedData.volunteer_organization_id)) {
    errors = { ...errors, volunteer_organization_id: 'A voluntária precisa ter um organization_id' }
  }
  if (!Validator.isNumeric(checkedData.volunteer_organization_id, { no_symbols: true })) {
    errors = { ...errors, volunteer_organization_id: 'organization_id da voluntária não contém apenas números' }
  }
  if (Validator.equals(checkedData.volunteer_organization_id, zendeskOrganizations.individual)) {
    errors = { ...errors, volunteer_organization_id: 'organization_id da voluntária não é válido' }
  }
  console.log({errors, isValid: hasError(errors)})
  return {
    errors,
    isValid: !hasError(errors)
  }
}

export default validate