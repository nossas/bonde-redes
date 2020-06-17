import Bottleneck from "bottleneck";

import { makeBatchRequests, composeUsers } from "./User";
import createZendeskTickets, { composeTickets } from "./Ticket";
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

export const handleIntegration = (widgets: Widget[]) => async (
  response: any
) => {
  let syncronizedForms = new Array();
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
    if (!userBatches) {
      log(
        `Zendesk user creation failed on these form entries:
        ${cache}`.red
      );
      return undefined;
    }

    if (
      userBatches.find((r) => r.error && r.error.match(/error/i)) ||
      userBatches.length < 1 ||
      usersToRegister.length < 1
    ) {
      log(
        "Zendesk user creation results with error:".red,
        userBatches.filter((u) => !!u.error)
      );
      return handleUserError(userBatches);
    }

    log("Preparing zendesk users to be saved in Hasura");
    const hasuraUsers = userBatches
      .filter((r) => !(r.error && r.error.match(/PermissionDenied/i)))
      .map((r) => {
        const user = usersToRegister.find(
          (u) => u.external_id === r.external_id
        );
        return {
          ...user,
          ...((user && user.user_fields) || {}),
          community_id: Number(process.env.COMMUNITY_ID),
          user_id: r.id,
        };
      });

    const withoutDuplicates = removeDuplicatesBy((x) => x.user_id, hasuraUsers);

    // Create users tickets if they're not "desabilitada"
    // approved MSRs and not a volunteer
    const removeDesabilitadedUsers = withoutDuplicates.filter(
      (user) => user["condition"] && user["condition"] !== "desabilitada"
    );

    if (removeDesabilitadedUsers.length > 0) {
      const tickets = await composeTickets(removeDesabilitadedUsers);
      // log(JSON.stringify(tickets, null, 2));
      await limiter.schedule(() => createZendeskTickets(tickets));
    }

    // Save users in Hasura
    const inserted = await insertSolidarityUsers(withoutDuplicates);
    if (!inserted) return handleUserError(withoutDuplicates);

    // Batch update syncronized forms
    syncronizedForms = [
      ...syncronizedForms,
      ...inserted.filter((i) => !!i.external_id).map((i) => i.external_id),
    ];
    const updateEntries = await updateFormEntries(syncronizedForms);
    if (!updateEntries) {
      log(
        `Couldn't update form entries with already syncronized forms: ${syncronizedForms}`
          .red
      );
      return undefined;
    }
    log({ syncronizedForms });
    log("User integration is done.");
    return (cache = []);
  } else {
    log("No items for integration.");
  }
};

export default handleIntegration;
