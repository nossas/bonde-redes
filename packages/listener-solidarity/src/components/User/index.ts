import { makeBatchRequests, composeUser } from "./";
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
    const usersToRegister = await composeUser(cache, widgets);
    return Promise.all(usersToRegister).then(async (users: any) => {
      // Batch insert individuals
      log("Creating users in Zendesk...");
      // log(users);
      // Create users in Zendesk
      // Cb create users in Hasura
      await makeBatchRequests(users);
      return (cache = []);
    });
  } else {
    log("No items for integration.");
  }
};

export default handleIntegration;

export { default as createZendeskUsers } from "./createZendeskUsers";
export { default as makeBatchRequests } from "./batchRequests";
export { default as saveUsersHasura } from "./saveUsersHasura";
export { default as composeUser } from "./composeUser";
