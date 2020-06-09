import client from "../../zendesk";
import { User, ZendeskUserCreationResponse } from "../../types";
import dbg from "../../dbg";

const log = dbg.extend("createZendeskUsers");

export default async (
  users: User[]
): Promise<ZendeskUserCreationResponse[] | undefined> => {
  log(`${new Date()}: \nEntering createZendeskUser`);

  return new Promise((resolve) => {
    return client.users.createOrUpdateMany(
      { users },
      (err, _req, result: any) => {
        if (err) {
          log(err);
          return resolve(undefined);
        }
        return client.jobstatuses.watch(
          result["job_status"].id,
          5000,
          0,
          (err, _req, result: any) => {
            if (err) {
              log(err);
              return resolve(undefined);
            }
            // log(
            //   `Results from zendesk user creation ${JSON.stringify(
            //     result,
            //     null,
            //     2
            //   )}`
            // );
            if (
              result &&
              result["job_status"] &&
              result["job_status"]["status"] === "completed"
            ) {
              return resolve(result["job_status"]["results"]);
            }
          }
        );
      }
    );
  });
};
