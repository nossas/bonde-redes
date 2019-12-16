import Validator from 'validator'
import isEmpty from './is-empty'

const checkField = input => !isEmpty(input) ? String(input) : ''

const validate = data => {
  const errors = {
    agent: '',
    individual_name: '',
    individual_ticket_id: '',
    volunteer_name: '',
    volunteer_user_id: '',
    volunteer_registry: '',
    volunteer_phone: '',
    volunteer_organization_id: ''

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
    errors.agent = 'ID do agente deve conter apenas números'
  }
  if (Validator.isEmpty(checkedData.agent)) {
    errors.agent = 'Selecione um agente'
  }

  // Nome da MSR
  if (Validator.isEmpty(checkedData.individual_name)) {
    errors.individual_name = 'O nome da MSR é obrigatório'
  }

  // Ticket ID da MSR
  if (!Validator.isNumeric(checkedData.individual_ticket_id, { no_symbols: true })) {
    errors.individual_ticket_id = 'ID do ticket da MSR deve conter apenas números'
  }
  if (Validator.isEmpty(checkedData.individual_ticket_id)) {
    errors.individual_ticket_id = 'Selecione uma MSR'
  }

  // Nome da Voluntária
  if (Validator.isEmpty(checkedData.volunteer_name)) {
    errors.volunteer_name = 'O nome da voluntária é obrigatório'
  }

  // User ID da Voluntária
  if (!Validator.isNumeric(checkedData.volunteer_user_id, { no_symbols: true })) {
    errors.volunteer_user_id = 'user_id da voluntária deve conter apenas números'
  }
  if (Validator.isEmpty(checkedData.volunteer_user_id)) {
    errors.volunteer_user_id = 'Selecione uma Voluntária'
  }

  // Registro da Voluntária
  if (Validator.isEmpty(checkedData.volunteer_registry)) {
    errors.volunteer_registry = 'A voluntária precisa ter um número de registro'
  }

  // Telefone da Voluntária
  if (Validator.isEmpty(checkedData.volunteer_phone)) {
    errors.volunteer_phone = 'A voluntária precisa ter um número de telefone'
  }
  if (!Validator.isNumeric(checkedData.volunteer_phone)) {
    errors.volunteer_phone = 'Número da voluntária não é válido'
  }

  // Organização da Voluntária
  if (Validator.isEmpty(checkedData.volunteer_organization_id)) {
    errors.volunteer_organization_id = 'A voluntária precisa ter um organization_id'
  }
  if (!Validator.isNumeric(checkedData.volunteer_organization_id, { no_symbols: true })) {
    errors.volunteer_organization_id = 'organization_id da voluntária não contém apenas números'
  }
  if (Validator.equals(checkedData.volunteer_organization_id, zendeskOrganizations.individual)) {
    errors.volunteer_organization_id = 'organization_id da voluntária não é válido'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

export default validate