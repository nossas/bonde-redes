const zendeskOrganizations = JSON.parse(process.env.REACT_APP_ZENDESK_ORGANIZATIONS)

export const filterByUserType = data => data.filter(
  (i) => i.organization_id === zendeskOrganizations.individual
)

export const checkVolunteerCategory = volunteerCategory => {
  if (volunteerCategory === zendeskOrganizations.lawyer) return 'jurídico'
  if(volunteerCategory === zendeskOrganizations.therapist) return 'psicológico' 
}

export const filterByCategory = (data, volunteerCategory) => data.filter(
  (i) => (
    i.tipo_de_acolhimento === checkVolunteerCategory(volunteerCategory) ||
    i.tipo_de_acolhimento === 'psicológico_e_jurídico'
  )
)

export const filterByTicketStatus = data => data.filter(
  (i) => (
    i.ticket_status === 'new' || i.ticket_status === 'open' && i.status_acolhimento === 'solicitacao_recebida'
  )
)