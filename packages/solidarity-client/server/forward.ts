import zendesk from 'node-zendesk'
import volunteerComment from './comments/volunteer'
import individualComment from './comments/individual'
import validate from './validator/forward'
import path from 'path'
import {
  getCurrentDate,
  getVolunteerFile,
  getVolunteerType
} from './parse/index'

const {
  ZENDESK_API_URL,
  ZENDESK_API_USER,
  ZENDESK_API_TOKEN,
} = process.env

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

  const handleError = ({ error, message }) => {
    console.log(error)
    res.json({ error, message })
    process.exit(-1)
  }

  const individualTicket = matchTicketId => ({
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
          volunteer_type: getVolunteerType(volunteer_organization_id),
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

  const volunteerTicket = () => ({
    "ticket":
    {
      "requester_id": volunteer_user_id,
      "submitter_id": agent,
      "assignee_id": agent,
      "status": "pending",
      "subject": `[${getVolunteerType(volunteer_organization_id).type}] ${volunteer_name}`,
      "comment": {
        "body": volunteerComment({
          volunteer_name,
          individual_name,
          assignee_name
        }),
        "author_id": agent,
        "public": false
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
  });

  const updateComment = (tokens) => ({
    "ticket": {
      "comment": {
        "body": volunteerComment({
          volunteer_name,
          individual_name,
          assignee_name
        }),
        "author_id": agent,
        "public": true,
        "uploads": tokens
      }
    }
  })

  const updateTicket = ({ ticketId, content, errMsg }) => {
    client.tickets.update(ticketId, content, (err, req, result) => {
      if (err) {
        return handleError({
          error: err,
          message: errMsg
        })
      }
    });
  }

  const createTicket = (tokens) => {
    // @ts-ignore
    return client.tickets.create(volunteerTicket(), (err, req, result: any) => {
      if (err) {
        return handleError({
          error: err,
          message: "The Volunteer ticket couldn't be created"
        })
      }

      const { id } = result

      updateTicket({
        content: updateComment(tokens),
        ticketId: id,
        errMsg: "The match ticket couldn't be updated"
      })

      updateTicket({
        content: individualTicket(id),
        ticketId: individual_ticket_id,
        errMsg: "The MSR ticket couldn't be updated"
      })

      res.json({ ticketId: id })
    });
  }

  const uploadFiles = () => {
    const { errors, isValid } = validate(req.body)

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors)
    }

    // Upload guia
    return client.attachments.upload(path.resolve(__dirname, '..',
      './assets/guia_do_acolhimento.pdf'),
      {
        filename: 'Guia_do_Acolhimento.pdf'
      }, (err, req, result: any) => {
        if (err) {
          console.log(err);
          return;
        }
        const guia = result["upload"]["token"]

        // Upload diretrizes
        const file = getVolunteerFile(volunteer_organization_id)
        return client.attachments.upload(path.resolve(__dirname, '..',
        `./assets/${file.path}`),
        {
          filename: file.filename
        }, (err, req, result: any) => {
          if (err) {
            console.log(err);
            return;
          }
          const diretriz = result["upload"]["token"]
          
          // Update ticket with both files
          const tokens = [guia, diretriz]
          return createTicket(tokens)
      })
    })
  }

  uploadFiles()
}

export default main