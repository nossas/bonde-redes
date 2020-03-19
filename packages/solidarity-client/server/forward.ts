import zendesk from "node-zendesk";
import path from "path";

import saveSolidarityMatches from "./hasura/saveSolidarityMatches";
import saveSolidarityTickets from "./hasura/saveSolidarityTickets";

import volunteerComment from "./comments/volunteer";
import validate from "./validator/forward";
import volunteerTicket from "./tickets/volunteer";
import individualTicket from "./tickets/individual";
import { getVolunteerFile } from "./parse/index";

const {
  ZENDESK_API_URL,
  ZENDESK_API_USER,
  ZENDESK_API_TOKEN,
  COMMUNITY_ID
} = process.env;

type Body = {
  volunteer_name: string;
  volunteer_registry: string;
  volunteer_phone: string;
  volunteer_user_id: number;
  volunteer_organization_id: number;
  individual_name: string;
  individual_ticket_id: number;
  individual_user_id: number;
  agent: string;
  assignee_name: string;
};

const main = async (req, res) => {
  const client = zendesk.createClient({
    username: ZENDESK_API_USER || "",
    token: ZENDESK_API_TOKEN || "",
    remoteUri: ZENDESK_API_URL || ""
  });

  const {
    volunteer_name,
    volunteer_registry,
    volunteer_phone,
    volunteer_user_id,
    volunteer_organization_id,
    individual_name,
    individual_ticket_id,
    individual_user_id,
    agent,
    assignee_name
  }: Body = req.body;

  const volunteer_first_name = volunteer_name.split(" ")[0];

  const handleError = ({ error, message }) => {
    console.log(error);
    return res.status(500).json(message);
  };

  const updateComment = tokens => ({
    ticket: {
      comment: {
        body: volunteerComment({
          volunteer_name: volunteer_first_name,
          individual_name,
          assignee_name
        }),
        author_id: agent,
        public: true,
        uploads: tokens
      }
    }
  });

  const updateTicket = async ({
    ticketId,
    content,
    errMsg,
    isVolunteer = false
  }): Promise<any> => {
    return client.tickets.update(ticketId, content, async (err, result) => {
      if (err) {
        return handleError({
          error: err,
          message: errMsg
        });
      }

      if (isVolunteer && typeof result === "object") {
        // @ts-ignore
        const saveTicketInHasura = await saveSolidarityTickets(result);
        if (!saveTicketInHasura) {
          console.log(
            `Failed to save volunteer solidarity_ticket '${ticketId}' in Hasura.`
          );
          return res
            .status(500)
            .json("Failed to update volunteer solidarity_ticket in Hasura.");
        }

        const saveMatchInHasura = await saveSolidarityMatches({
          individuals_ticket_id: individual_ticket_id,
          volunteers_ticket_id: ticketId,
          individuals_user_id: individual_user_id,
          volunteers_user_id: volunteer_user_id,
          community_id: Number(COMMUNITY_ID),
          status: "encaminhamento__realizado",
          created_at: new Date().toISOString()
        });

        if (!saveMatchInHasura) {
          console.log(
            `Failed to save match '${ticketId}' in solidarity_matches in Hasura.`
          );
          return res
            .status(500)
            .json(`Failed to save the match ticket in Hasura`);
        }
      }

      return true;
    });
  };

  const createTicket = tokens => {
    // Cria o ticket da voluntária
    return client.tickets.create(
      // @ts-ignore
      volunteerTicket({
        volunteer_user_id,
        agent: Number(agent),
        volunteer_first_name,
        individual_name,
        assignee_name,
        volunteer_organization_id,
        individual_ticket_id
      }),
      async (err, result: any) => {
        if (err) {
          return handleError({
            error: err,
            message: "The Volunteer ticket couldn't be created"
          });
        }

        const { id: volunteer_ticket_id } = result;

        // Atualiza o ticket da voluntária com o comentário público e os anexos
        await updateTicket({
          content: updateComment(tokens),
          ticketId: volunteer_ticket_id,
          errMsg: "The match ticket couldn't be updated",
          isVolunteer: true
        });

        // Atualiza o ticket da MSR com os dados do match
        await updateTicket({
          content: individualTicket({
            match_ticket_id: volunteer_ticket_id,
            agent,
            volunteer_name,
            volunteer_organization_id,
            volunteer_first_name,
            volunteer_registry,
            volunteer_phone,
            assignee_name,
            individual_name
          }),
          ticketId: individual_ticket_id,
          errMsg: "The MSR ticket couldn't be updated"
        });

        return res.json({ ticketId: volunteer_ticket_id });
      }
    );
  };

  const uploadFiles = () => {
    const { errors, isValid } = validate(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Upload guia
    return client.attachments.upload(
      path.resolve(__dirname, "..", "./assets/guia_do_acolhimento.pdf"),
      {
        filename: "Guia_do_Acolhimento.pdf"
      },
      (err, result: any) => {
        if (err) {
          return handleError({
            error: err,
            message: "The volunteer guide couldn't be uplodaded"
          });
        }
        const guia = result.upload.token;

        // Upload diretrizes
        const file = getVolunteerFile(volunteer_organization_id);
        return client.attachments.upload(
          path.resolve(__dirname, "..", `./assets/${file.path}`),
          {
            filename: file.filename
          },
          (error, results: any) => {
            if (error) {
              return handleError({
                error: err,
                message: "The volunteer directive couldn't be uplodaded"
              });
            }
            const diretriz = results.upload.token;

            // Update ticket with both files
            const tokens = [guia, diretriz];
            return createTicket(tokens);
          }
        );
      }
    );
  };

  uploadFiles();
};

export default main;
