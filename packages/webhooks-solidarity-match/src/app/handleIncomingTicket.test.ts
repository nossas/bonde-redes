import handleIncomingTicket from "./handleIncomingTicket"
import { IncomingRequestData } from "../interfaces/IncomingRequestData"

const data = {
  "event": {
    "session_variables": {
      "x-hasura-role": "admin"
    },
    "op": "INSERT",
    "data": {
      "old": null,
      "new": {
        "subject": "[Advogada] Cláudia",
        "status": "solved",
        "requester_id": 377559885471,
        "nome_voluntaria": null,
        "raw_subject": "[Advogada] Cláudia",
        "telefone": null,
        "submitter_id": 377577169651,
        "estado": null,
        "data_encaminhamento": "2019-08-26",
        "ticket_id": 13044,
        "status_acolhimento": "encaminhamento__realizado",
        "organization_id": 360269610652,
        "community_id": 22,
        "link_match": "https://mapadoacolhimento.zendesk.com/agent/tickets/8412",
        "updated_at": "2019-09-09T20:03:01",
        "nome_msr": "Giovanna",
        "status_inscricao": null,
        "created_at": "2019-08-26T16:59:02",
        "id": 4215,
        "custom_fields": [
          {
            "value": null,
            "id": 360021879811
          },
          {
            "value": null,
            "id": 360016631592
          },
          {
            "value": "2019-08-26",
            "id": 360017432652
          },
          {
            "value": "https://mapadoacolhimento.zendesk.com/agent/tickets/8412",
            "id": 360016631632
          },
          {
            "value": null,
            "id": 360017056851
          },
          {
            "value": null,
            "id": 360021665652
          },
          {
            "value": "encaminhamento__realizado",
            "id": 360014379412
          },
          {
            "value": null,
            "id": 360021812712
          },
          {
            "value": null,
            "id": 360021879791
          },
          {
            "value": "Giovanna",
            "id": 360016681971
          }
        ],
        "group_id": 360003100392,
        "webhooks_registry_id": null,
        "data_inscricao_bonde": null,
        "assignee_id": 377577169651,
        "cidade": null,
        "description": "**EMAIL PARA A MSR**\nOlá, Giovanna!\n\nBoa notícia!\n\nConseguimos localizar uma advogada​ disponível próxima a você. Estamos te enviando os dados abaixo para que entre em contato em até 30 dias. É muito importante atentar-se a esse prazo pois, após esse período, a sua vaga irá expirar. Não se preocupe, caso você não consiga, poderá se cadastrar novamente no futuro.\n\nAdvogada​: Cláudia\nTelefone: 1130705466​\nOAB: 231281\n\nTodos os atendimentos do Mapa devem ser gratuitos pelo tempo que durarem. Caso você seja cobrada, comunique imediatamente a nossa equipe. No momento de contato com a voluntária, por favor, identifique que você buscou ajuda via Mapa do Acolhimento.\n\nAgradecemos pela coragem, pela confiança e esperamos que seja bem acolhida! Pedimos que entre em contato para compartilhar a sua experiência de atendimento.\n\nUm abraço,\nAna, da equipe Mapa do Acolhimento",
        "tags": [
          "5_ou_mais",
          "ana",
          "disponivel",
          "encaminhamento__realizado",
          "jurídico",
          "migracao-01",
          "sp"
        ]
      }
    }
  },
  "created_at": "2019-09-28T10:26:58.404815Z",
  "id": "63108ca8-5312-49df-b1cd-c0c46d656e79",
  "delivery_info": {
    "max_retries": 0,
    "current_retry": 0
  },
  "trigger": {
    "name": "solidarity-tickets"
  },
  "table": {
    "schema": "public",
    "name": "solidarity_tickets"
  },
  "headers": [
    {
      "value": "application/json",
      "name": "Content-Type"
    },
    {
      "value": "hasura-graphql-engine/v1.0.0-beta.6",
      "name": "User-Agent"
    }
  ],
  "version": "2"
} as IncomingRequestData

test('handle incoming request without errors', () => {
  expect(handleIncomingTicket(data)).toBeTruthy()
})
