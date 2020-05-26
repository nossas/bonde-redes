import client from "./";
import { User } from "../types";
import dbg from "../dbg";

const log = dbg.extend("createZendeskUser");

export default async (
  users: User[],
  cb: (
    results: Array<{ id: number; status: string; external_id: string }>,
    users: User[]
  ) => Promise<any> | undefined
) => {
  log(`${new Date()}: \nEntering createZendeskUser`);

  return client.users.createOrUpdateMany(
    { users },
    (err, _req, result: any) => {
      if (err) {
        log(err);
        return cb([], users);
      }
      return new Promise((resolve) => {
        return client.jobstatuses.watch(
          result["job_status"].id,
          500,
          5,
          (err, _req, result: any) => {
            if (err) {
              log(err);
              return cb([], users);
            }
            // log(
            //   `Results from zendesk user creation ${JSON.stringify(
            //     result["job_status"]["results"],
            //     null,
            //     2
            //   )}`
            // );
            cb(result["job_status"]["results"], users);
            return resolve();
          }
        );
      });
    }
  );
};
