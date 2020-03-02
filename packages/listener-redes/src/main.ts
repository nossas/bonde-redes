import gql from 'graphql-tag'
const throng = require('throng');
import { client as GraphQLAPI } from './graphql'

export const queryRedeGroups = () => {
  const redeGroupsQuery = gql`
  query redeGroupsQuery {
    rede_groups {
      id,
      community_id,
      widget_id,
      name,
      is_volunteer,
      metadata,
      created_at
    }
  }  `

  return GraphQLAPI.query({ query: redeGroupsQuery })
}

export const subscribeFormEntries = () => {
  const formEntriesQuery = gql`
    subscription pipeline_form_entries {
      form_entries {
        id,
        fields,
        cached_community_id,
        activist_id,
        widget_id,
        created_at
      }
    }
  `

  return GraphQLAPI.subscribe({ query: formEntriesQuery, fetchPolicy: "network-only" })
}

export interface ChatbotInteractionOpts {
  recipientId: number,
  senderId: number,
  chatbotId: number,
  interaction: any
}

export const insert = async (opts: ChatbotInteractionOpts): Promise<any> => {
  const { recipientId, senderId, chatbotId, interaction } = opts

  const insertRedeIndividualMutation = gql`
    mutation CreateRedeIndividual ($chatbotInteraction: chatbot_interactions_insert_input!) {
      mutation InsertCommunityUsers {
        insert_rede_individuals(objects: {
          name: "Valdir",
          last_name: "Machado",
          email: "valdir@machado.org",
          phone: "22222",
          address: "avenida paulista, 2000",
          city: "Rio de Janeiro",
          state: "RJ",
          latitude: "",
          longitude: "",
          register_occupation: "",
          whatsapp: "333333",
          field_occupation: "",
          agreement: false,
          rede_group_id: 2,
          form_entry_id: 1267111,
          created_at: "2019-09-03 00:00:00",
          updated_at: "2019-09-03 00:00:00"
        }) {
          returning {
            id
          }
        }
      }
    }
  `

  return GraphQLAPI.mutate({
    mutation: insertRedeIndividualMutation,
    variables: {
      chatbotInteraction: {
        chatbot_id: chatbotId,
        context_recipient_id: recipientId,
        context_sender_id: senderId,
        interaction: interaction
      }
    }
  })
}

/**
 * Some predefined delays (in milliseconds).
 */
export enum Delays {
  Short = 500,
  Medium = 2000,
  Long = 5000,
}

/**
 * Returns a Promise<string> that resolves after given time.
 *
 * @param {string} name - A name.
 * @param {number=} [delay=Delays.Medium] - Number of milliseconds to delay resolution of the Promise.
 * @returns {Promise<string>}
 */
function delayedHello(
  name: string,
  delay: number = Delays.Medium,
): Promise<string> {
  return new Promise((resolve: (value?: string) => void) =>
    setTimeout(() => resolve(`Hello, ${name}`), delay),
  );
}

// Below are examples of using ESLint errors suppression
// Here it is suppressing missing return type definitions for greeter function

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function greeter(name: string) {
  return await delayedHello(name, Delays.Short);
}

throng(async (id) => {
  console.log(`Started worker ${id}`);

  await subscribeFormEntries().subscribe(async (v) => {

    const redeGroups = await queryRedeGroups();
    const fe = v.data.form_entries
    const redeGroupsWidgetId = redeGroups.data.widget_id

    if (fe.widget_id === redeGroupsWidgetId) {
      fe.forEach(elFe => {
        JSON.parse(elFe.fields).forEach(elFs => {
            console.log(elFs.uid, elFs.value)
        });
        // console.log(redeGroups.data.rede_groups, v.data.form_entries.fields)
      });
    }
  });

  console.log(await greeter('my name'));

  process.on('SIGTERM', function() {
    console.log(`Worker ${id} exiting`);
    console.log('Cleanup here');
    process.exit();
  });
});