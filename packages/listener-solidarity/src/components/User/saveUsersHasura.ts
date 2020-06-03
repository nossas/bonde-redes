import createUserTickets from "../Ticket";
import {
  insertSolidarityUsers,
  updateFormEntries,
} from "../../graphql/mutations";
import { handleUserError, removeDuplicatesBy } from "../../utils";
import { User } from "../../types";
import dbg from "../../dbg";

const log = dbg.extend("createUsersHasura");
let syncronizedForms = new Array();

export default async (
  results: Array<{
    id: number;
    status: string;
    external_id: string;
    error?: string;
  }>,
  users: User[]
) => {
  if (
    results.find((r) => r.error && r.error.match(/error/i)) ||
    users.length < 1 ||
    results.length < 1
  ) {
    log(`Results with error: ${results}`);
    return handleUserError(users);
  }

  log("Preparing zendesk users to be saved in Hasura");
  const hasuraUsers = results.map((r) => {
    const user = users.find((u) => u.external_id === r.external_id);
    return {
      ...user,
      ...((user && user.user_fields) || {}),
      community_id: Number(process.env.COMMUNITY_ID),
      user_id: r.id,
    };
  });

  log("Saving users in Hasura...");
  const withoutDuplicates = removeDuplicatesBy((x) => x.user_id, hasuraUsers);
  // log({ withoutDuplicates: JSON.stringify(withoutDuplicates, null, 2) });

  const createTickets = await createUserTickets(withoutDuplicates);
  if (!createTickets) return handleUserError(users);

  const inserted = await insertSolidarityUsers(withoutDuplicates);
  if (!inserted) return handleUserError(users);

  // Batch update syncronized forms
  syncronizedForms = [
    ...syncronizedForms,
    ...inserted.map((i) => i.external_id),
  ];
  log("Updating form_entries syncronized on GraphQL API...");
  log({ syncronizedForms });
  const updateEntries = await updateFormEntries(syncronizedForms);
  if (!updateEntries) {
    log("Couldn't update form entries with already syncronized forms");
    return handleUserError(users);
  }

  return log("User integration is done.");
};
