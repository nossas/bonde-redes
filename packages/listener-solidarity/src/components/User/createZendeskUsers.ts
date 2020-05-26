import client from "../../zendesk";
import { User } from "../../types";
import dbg from "../../dbg";
import saveUsersHasura from "./saveUsersHasura";

const log = dbg.extend("createZendeskUsers");

export default async (users: User[]) => {
  log(`${new Date()}: \nEntering createZendeskUser`);

  return client.users.createOrUpdateMany(
    { users },
    (err, _req, result: any) => {
      if (err) {
        log(err);
        return saveUsersHasura([], users);
      }
      return new Promise((resolve) => {
        return client.jobstatuses.watch(
          result["job_status"].id,
          500,
          5,
          (err, _req, result: any) => {
            if (err) {
              log(err);
              return saveUsersHasura([], users);
            }
            // log(
            //   `Results from zendesk user creation ${JSON.stringify(
            //     result["job_status"]["results"],
            //     null,
            //     2
            //   )}`
            // );
            saveUsersHasura(result["job_status"]["results"], users);
            return resolve();
          }
        );
      });
    }
  );
};
