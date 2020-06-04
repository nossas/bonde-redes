import Bottleneck from "bottleneck";

import { makeBatchRequests, composeUsers } from "./User";
import { composeTickets, createZendeskTickets } from "./Ticket";
import { insertSolidarityUsers, updateFormEntries } from "../graphql/mutations";
import { getGeolocation, handleUserError, removeDuplicatesBy } from "../utils";
import { Widget, FormEntry } from "../types";
import dbg from "../dbg";

const log = dbg.extend("integration");

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
});

let cache = [];
let syncronizedForms = new Array();

export const handleIntegration = (widgets: Widget[]) => async (
  response: any
) => {
  log(`${new Date()}: \nReceiving data on subscription GraphQL API...`);
  // log({ response: response.data.form_entries });

  const {
    data: { form_entries: entries },
  } = response;

  cache = entries.map((entry: FormEntry) => {
    if (!cache.includes(entry.id as never)) return entry;
    return;
  });

  if (cache.length > 0) {
    const usersToRegister = await composeUsers(cache, widgets, getGeolocation);
    // log(usersToRegister);

    // Batch insert individuals
    // Create users in Zendesk
    const userBatches = await makeBatchRequests(usersToRegister);
    if (!userBatches) return handleUserError(cache);

    if (
      userBatches.find((r) => r.error && r.error.match(/error/i)) ||
      userBatches.length < 1 ||
      usersToRegister.length < 1
    ) {
      log("Zendesk user creation results with error:".red, userBatches);
      return handleUserError(cache);
    }

    log("Preparing zendesk users to be saved in Hasura");
    const hasuraUsers = userBatches.map((r) => {
      const user = usersToRegister.find((u) => u.external_id === r.external_id);
      return {
        ...user,
        ...((user && user.user_fields) || {}),
        community_id: Number(process.env.COMMUNITY_ID),
        user_id: r.id,
      };
    });
    const withoutDuplicates = removeDuplicatesBy((x) => x.user_id, hasuraUsers);
    // log({ withoutDuplicates: JSON.stringify(withoutDuplicates, null, 2) });

    // Create users tickets
    const tickets = await composeTickets(withoutDuplicates);
    // log(JSON.stringify(tickets, null, 2));
    await limiter.schedule(() => createZendeskTickets(tickets));

    // Save users in Hasura
    const inserted = await insertSolidarityUsers(withoutDuplicates);
    if (!inserted) return handleUserError(cache);

    // Batch update syncronized forms
    syncronizedForms = [
      ...syncronizedForms,
      ...inserted.map((i) => i.external_id),
    ];
    const updateEntries = await updateFormEntries(syncronizedForms);
    if (!updateEntries) {
      log("Couldn't update form entries with already syncronized forms");
      return handleUserError(cache);
    }
    log({ syncronizedForms });
    log("User integration is done.");
    return (cache = []);
  } else {
    log("No items for integration.");
  }
};

export default handleIntegration;
