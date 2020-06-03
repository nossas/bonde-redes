import { makeBatchRequests, composeUser } from "./";
import { getGeolocation, handleUserError } from "../../utils";
import { Widget, FormEntry } from "../../types";
import dbg from "../../dbg";

const log = dbg.extend("User");

let cache = [];

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
    const usersToRegister = await composeUser(cache, widgets, getGeolocation);
    // log(usersToRegister);
    // Batch insert individuals
    // Create users in Zendesk
    // Cb create users in Hasura
    const batches = await makeBatchRequests(usersToRegister);
    if (!batches) return handleUserError(entries);
    return (cache = []);
  } else {
    log("No items for integration.");
  }
};

export default handleIntegration;

export { default as createZendeskUsers } from "./createZendeskUsers";
export { default as makeBatchRequests } from "./batchRequests";
export { default as saveUsersHasura } from "./saveUsersHasura";
export { default as composeUser } from "./composeUsers";
