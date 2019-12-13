import zendesk from 'node-zendesk'
const { ZENDESK_API_URL, ZENDESK_API_USER, ZENDESK_API_TOKEN } = process.env

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
  // client.tickets.show(req.body.individual_ticket_id, (err, req, result) => {
  //   if (err) return handleError(err);
  //   res.json(result, null, 2, true);
  // });
  
  const client = zendesk.createClient({
    username:  ZENDESK_API_USER,
    token:     ZENDESK_API_TOKEN,
    remoteUri: ZENDESK_API_URL 
  });
  console.log({ ticketID: req.body.individual_ticket_id })
  var ticket = {
    "ticket":
      {
        "status":"pending",
      }
  };
  const ticket_id = req.body.individual_ticket_id
  client.tickets.update(ticket_id, ticket, (err, req, result) => {
    if (err) return handleError(err);
    res.json(result, null, 2, true);
  });

  const handleError = err => {
    console.log(err);
    process.exit(-1);
  }
}

export default main

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