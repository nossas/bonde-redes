import zendesk from 'node-zendesk'
import volunteerComment from './comments/volunteer'
import individualComment from './comments/individual'

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

const main = async (req, res, next) => {
  // res.json(req.body);
  // const client = zendesk.createClient({
  //   username:  ZENDESK_API_USER,
  //   token:     'oauth_token',
  //   remoteUri: ZENDESK_API_URL,
  //   oauth: true,
  //   asUser: req.body.agent
  // });
  // client.users.auth((err, req, result) => {
  //   if (err) {
  //     console.log(err);
  //     return;
  //   }
  //   res.json(JSON.stringify(result.verified, null, 2, true));
  // });
  
  const client = zendesk.createClient({
    username: ZENDESK_API_USER,
    token: ZENDESK_API_TOKEN,
    remoteUri: ZENDESK_API_URL
  });
  
  const {
    volunteer_name,
    volunteer_ticket_id,
    volunteer_registry,
    volunteer_tel,
    volunteer_user_id,
    volunteer_organization_id,
    individual_name,
    individual_ticket_id,
    agent
  } = req.body

  const assignee_name = 'Ana'
  var individualTicket = {
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
      ],
      "comment": {
        "body": individualComment({
          volunteer: {
            name: volunteer_name,
            registry: volunteer_registry,
            tel: volunteer_tel
          },
          assignee_name,
          individual_name
        }),
        "author_id": agent,
        "public": true,
      },
    }
  };

  const volunteerTicket = {
    "ticket":
    {
      "requester_id": volunteer_user_id,
      "submitter_id": agent,
      "assignee_id": agent,
      "status": "pending",
      "recipient": volunteer_name,
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

  
  const updateTicket = () => {
    client.tickets.update(volunteer_ticket_id, volunteerTicket, (err, req, result) => {
      if (err) return handleError(err);
      res.json(result, null, 2, true);
    });
  }

  client.tickets.create(volunteerTicket, (err, req, result) => {
    if (err) return handleError(err);
    res.json(result, null, 2, true);
    // const { id } = result
    // updateTicket(id)
  });
  
  // res.json(volunteerTicket)

  const handleError = err => {
    console.log(err);
    process.exit(-1);
  }
}

export default main

// {
//   "ticket": {
//       "status": "pending", // status do acolhimento
//       "recipient": "Ana", // nome da voluntária
//       "requester_id": 377577169651 // user_id da voluntária
//       "submitter_id": 373018450472, // agente que cria o ticket
//       "assignee_id": 373018450472, // responsavel pelo ticket
//       "subject": "[Advogada] Ana", // titulo do ticket
      // "fields": [
      //     {
      //         "id": 360016681971, // nome da msr
      //         "value": "Joana"
      //     },
      //     {
      //         "id": 360016631632, // link do match (link do ticket da msr)
      //         "value": "https://mapadoacolhimento.zendesk.com/agent/tickets/12586"
      //     }
      // ],
//       "comments": { // comentário público para a voluntária
//           "body": "Olá, Ana!\n\nBoa notícia!\nViemos te contar que o seu número de atendimento acaba de ser enviado para a Joana, pois você é a voluntária disponível mais próxima.\n\n**Para o nosso registro, é muito importante que nos avise sempre que iniciar os atendimentos. Lembre-se de que eles devem ser integralmente gratuitos e que o seu comprometimento em acolhê-la e acompanhá-la neste momento é fundamental.**\n\nEm anexo, estamos te enviando dois documentos muito importantes: **as diretrizes de atendimento do Mapa do Acolhimento, com todas as nossas regras e valores, e a Guia do Acolhimento,** uma cartilha para te ajudar a conduzir os atendimentos da melhor forma possível.\n\nQualquer dúvida ou dificuldade, por favor nos comunique.\nÉ muito bom saber que podemos contar com você!\nUm abraço,\n\nAna do Mapa do Acolhimento",
//           "author_id": 373018450472,
//           "public": true
//       }
//   }
// }

// {
//   "url": "https://mapadoacolhimento.zendesk.com/api/v2/tickets/12586.json",
//   "id": 12586,
//   "external_id": "1231000",
//   "via": {
//       "channel": "api",
//       "source": {
//           "from": {},
//           "to": {},
//           "rel": null
//       }
//   },
//   "created_at": "2019-08-07T21:37:06Z",
//   "updated_at": "2019-09-24T21:49:20Z",
//   "type": null,
//   "subject": "[Jurídico] teste, Natal - RN",
//   "raw_subject": "[Jurídico] teste, Natal - RN",
//   "description": "Importado pelo BONDE.",
//   "priority": null,
//   "status": "new",
//   "recipient": null,
//   "requester_id": 385569543392,
//   "submitter_id": 385569543392,
//   "assignee_id": null,
//   "organization_id": 360273031591,
//   "group_id": null,
//   "collaborator_ids": [],
//   "follower_ids": [],
//   "email_cc_ids": [],
//   "forum_topic_id": null,
//   "problem_id": null,
//   "has_incidents": false,
//   "is_public": true,
//   "due_at": null,
//   "tags": [
//       "inscrita",
//       "psicológico_e_jurídico",
//       "rn",
//       "solicitação_recebida"
//   ],
//   "custom_fields": [
//       {
//           "id": 360021879811,
//           "value": "cidade6"
//       },
//       {
//           "id": 360016631592,
//           "value": ""
//       },
//       {
//           "id": 360017432652,
//           "value": null
//       },
//       {
//           "id": 360016631632,
//           "value": null
//       },
//       {
//           "id": 360017056851,
//           "value": "2019-08-07"
//       },
//       {
//           "id": 360021665652,
//           "value": null
//       },
//       {
//           "id": 360014379412,
//           "value": "solicitação_recebida"
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
//           "value": "teste"
//       }
//   ],
//   "satisfaction_rating": null,
//   "sharing_agreement_ids": [],
//   "fields": [
//       {
//           "id": 360021879811,
//           "value": "cidade6"
//       },
//       {
//           "id": 360016631592,
//           "value": ""
//       },
//       {
//           "id": 360017432652,
//           "value": null
//       },
//       {
//           "id": 360016631632,
//           "value": null
//       },
//       {
//           "id": 360017056851,
//           "value": "2019-08-07"
//       },
//       {
//           "id": 360021665652,
//           "value": null
//       },
//       {
//           "id": 360014379412,
//           "value": "solicitação_recebida"
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
//           "value": "teste"
//       }
//   ],
//   "followup_ids": [],
//   "brand_id": 360001789192,
//   "allow_channelback": false,
//   "allow_attachments": true
// }