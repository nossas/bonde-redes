import { User } from "../../types";
import { handleError } from "../../utils";
import {
  insertSolidarityUsers,
  updateFormEntries,
} from "../../graphql/mutations";
import dbg from "../../dbg";

const log = dbg.extend("createUsersHasura");
let syncronizedForms = new Array();

export default async (
  results: Array<{ id: number; status: string; external_id: string }>,
  users: User[]
) => {
  if (results.find((r) => r.status === "Failed") || users.length < 1) {
    return handleError(users);
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
  const inserted = await insertSolidarityUsers(hasuraUsers);
  if (!inserted) return handleError(users);

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
    return handleError(users);
  }

  return log("Integration is done.");
};
