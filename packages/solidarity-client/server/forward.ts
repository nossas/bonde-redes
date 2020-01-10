import zendesk from 'node-zendesk'
import volunteerComment from './comments/volunteer'
import individualComment from './comments/individual'
import validate from './validator/forward'

const {
  ZENDESK_API_URL,
  ZENDESK_API_USER,
  ZENDESK_API_TOKEN,
  REACT_APP_ZENDESK_ORGANIZATIONS
} = process.env

const zendeskOrganizations = JSON.parse(REACT_APP_ZENDESK_ORGANIZATIONS || '{}')
const volunteerType = id => {
  console.log({
    volunteerType: typeof id,
    type: typeof zendeskOrganizations,
    type2: typeof zendeskOrganizations["lawyer"],
    withoutParse: REACT_APP_ZENDESK_ORGANIZATIONS,
    withParse: zendeskOrganizations,
    isTrue: id === zendeskOrganizations["lawyer"]
  })
  if (id === zendeskOrganizations["lawyer"]) return 'Advogada'
  if (id === zendeskOrganizations["therapist"]) return 'Psicóloga'
  throw "Volunteer organization_id not supported"
}

const getCurrentDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()

  return `${yyyy}-${mm}-${dd}`
}

const main = async (req, res, next) => {

  const client = zendesk.createClient({
    username: ZENDESK_API_USER || '',
    token: ZENDESK_API_TOKEN || '',
    remoteUri: ZENDESK_API_URL || ''
  });

  const {
    volunteer_name,
    volunteer_ticket_id,
    volunteer_registry,
    volunteer_phone,
    volunteer_user_id,
    volunteer_organization_id,
    individual_name,
    individual_ticket_id,
    agent,
    assignee_name
  } = req.body

  var individualTicket = matchTicketId => ({
    "ticket":
    {
      // "status": 'pending',
      "assignee_id": agent,
      "fields": [
        {
          "id": 360016631592,
          "value": volunteer_name
        },
        {
          "id": 360014379412,
          "value": 'encaminhamento__realizado'
        },
        {
          "id": 360016631632,
          "value": `https://mapadoacolhimento.zendesk.com/agent/tickets/${matchTicketId}`
        },
        {
          "id": 360017432652,
          "value": String(getCurrentDate())
        },
      ],
      "comment": {
        "body": individualComment({
          volunteer: {
            name: volunteer_name,
            registry: volunteer_registry,
            tel: volunteer_phone
          },
          assignee_name,
          individual_name
        }),
        "author_id": agent,
        "public": true,
      },
    }
  })

  const volunteerTicket = {
    "ticket":
    {
      "requester_id": volunteer_user_id,
      "submitter_id": agent,
      "assignee_id": agent,
      // "status": 'pending',
      "subject": `[${volunteerType(volunteer_organization_id)}] ${volunteer_name}`,
      "comment": {
        "body": volunteerComment({
          volunteer_name,
          individual_name,
          assignee_name
        }),
        "author_id": agent,
        "public": true,
      },
      "fields": [
        {
          "id": 360016681971,
          "value": individual_name
        },
        {
          "id": 360016631632,
          "value": `https://mapadoacolhimento.zendesk.com/agent/tickets/${individual_ticket_id}`
        },
        {
          "id": 360014379412,
          "value": 'encaminhamento__realizado'
        },
        {
          "id": 360017432652,
          "value": String(getCurrentDate())
        },
      ],
    }
  };

  const handleError = ({ error, message }) => {
    console.log(error);
    res.json({ error, message })
    process.exit(-1);
  }

  const updateTicket = id => {
    client.tickets.update(individual_ticket_id, individualTicket(id), (err, req, result) => {
      if (err) {
        return handleError({
          error: err,
          message: "The MSR ticket couldn't be updated"
        })
      }
      res.json({ ticketId: id })
    });
  }

  const createTicket = () => {
    const { errors, isValid } = validate(req.body)

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors)
    }

    return client.tickets.create(volunteerTicket, (err, req, result: any) => {
      if (err) {
        return handleError({
          error: err,
          message: "The Volunteer ticket couldn't be created"
        })
      }
      const { id } = result
      updateTicket(id)
    });
  }

  createTicket()
}

export default main