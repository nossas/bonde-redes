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

const zendeskOrganizations = JSON.parse(REACT_APP_ZENDESK_ORGANIZATIONS)
const volunteerType = id => {
  if (id === zendeskOrganizations.lawyer) return 'Advogada'
  if (id === zendeskOrganizations.therapist) return 'Psicóloga'
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
    username: ZENDESK_API_USER,
    token: ZENDESK_API_TOKEN,
    remoteUri: ZENDESK_API_URL
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
    agent
  } = req.body

  const assignee_name = 'Ana'
  var individualTicket = matchTicketId => ({
    "ticket":
    {
      "status": "pending",
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
      "status": "pending",
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


  // client.tickets.getComments(volunteer_ticket_id, (err, req, result) => {
  //   if (err) return handleError(err);
  //   res.json(result, null, 2, true);
  // });

  // client.tickets.show(volunteer_ticket_id, (err, req, result) => {
  //   if (err) return handleError(err);
  //   res.json(result, null, 2, true);
  // });

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

    return client.tickets.create(volunteerTicket, (err, req, result) => {
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

// {
//   "url": "https://mapadoacolhimento.zendesk.com/api/v2/tickets/15617.json",
//   "id": 15617,
//   "external_id": null,
//   "via": {
//       "channel": "web",
//       "source": {
//           "from": {},
//           "to": {},
//           "rel": null
//       }
//   },
//   "created_at": "2019-11-28T18:49:55Z",
//   "updated_at": "2019-12-09T04:19:15Z",
//   "type": null,
//   "subject": "[Advogada] GABRIELA",
//   "raw_subject": "[Advogada] GABRIELA",
//   "description": "**EMAIL PARA A MSR**\nOlá, Irma!\n\nBoa notícia!\n\nConseguimos localizar uma advogada​ disponível próxima a você. Estamos te enviando os dados abaixo para que entre em contato em até 30 dias. É muito importante atentar-se a esse prazo pois, após esse período, a sua vaga irá expirar. Não se preocupe, caso você não consiga, poderá se cadastrar novamente no futuro.\n\nAdvogada​: GABRIELA\nTelefone: 48984782324​\nOAB: 49225\n\nTodos os atendimentos do Mapa devem ser gratuitos pelo tempo que durarem. Caso você seja cobrada, comunique imediatamente a nossa equipe. No momento de contato com a voluntária, por favor, identifique que você buscou ajuda via Mapa do Acolhimento.\n\nAgradecemos pela coragem, pela confiança e esperamos que seja bem acolhida! Pedimos que entre em contato para compartilhar a sua experiência de atendimento.\n\nUm abraço,\nAle, da equipe Mapa do Acolhimento",
//   "priority": null,
//   "status": "open",
//   "recipient": null,
//   "requester_id": 377567481991,
//   "submitter_id": 377510044432,
//   "assignee_id": 373018450472,
//   "organization_id": 360269610652,
//   "group_id": 360004360071,
//   "collaborator_ids": [],
//   "follower_ids": [],
//   "email_cc_ids": [],
//   "forum_topic_id": null,
//   "problem_id": null,
//   "has_incidents": false,
//   "is_public": true,
//   "due_at": null,
//   "tags": [
//       "1",
//       "antiga",
//       "branca",
//       "disponivel",
//       "encaminhamento__realizado",
//       "jurídico",
//       "mapa",
//       "migracao-01",
//       "sc"
//   ],
//   "custom_fields": [
//       {
//           "id": 360021879811,
//           "value": null
//       },
//       {
//           "id": 360016631592,
//           "value": null
//       },
//       {
//           "id": 360017432652,
//           "value": "2019-11-28"
//       },
//       {
//           "id": 360016631632,
//           "value": "https://mapadoacolhimento.zendesk.com/agent/tickets/8757"
//       },
//       {
//           "id": 360017056851,
//           "value": null
//       },
//       {
//           "id": 360021665652,
//           "value": null
//       },
//       {
//           "id": 360014379412,
//           "value": "encaminhamento__realizado"
//       },
//       {
//           "id": 360021812712,
//           "value": null
//       },
//       {
//           "id": 360021879791,
//           "value": null
//       },
//       {
//           "id": 360016681971,
//           "value": "Irma"
//       }
//   ],
//   "satisfaction_rating": null,
//   "sharing_agreement_ids": [],
//   "fields": [
//       {
//           "id": 360021879811,
//           "value": null
//       },
//       {
//           "id": 360016631592,
//           "value": null
//       },
//       {
//           "id": 360017432652,
//           "value": "2019-11-28"
//       },
//       {
//           "id": 360016631632,
//           "value": "https://mapadoacolhimento.zendesk.com/agent/tickets/8757"
//       },
//       {
//           "id": 360017056851,
//           "value": null
//       },
//       {
//           "id": 360021665652,
//           "value": null
//       },
//       {
//           "id": 360014379412,
//           "value": "encaminhamento__realizado"
//       },
//       {
//           "id": 360021812712,
//           "value": null
//       },
//       {
//           "id": 360021879791,
//           "value": null
//       },
//       {
//           "id": 360016681971,
//           "value": "Irma"
//       }
//   ],
//   "followup_ids": [],
//   "brand_id": 360001789192,
//   "allow_channelback": false,
//   "allow_attachments": true
// }