import client from "./";
import { User } from "../types";
import dbg from "../dbg";

const log = dbg.extend("createZendeskUser");

export default async (
  users: User[],
  cb: (
    results: Array<{ id: number; status: string; external_id: string }>,
    users: User[]
  ) => Promise<any>
) => {
  return client.users.createMany({ users }, (err, _req, result: any) => {
    if (err) {
      log(err);
      return cb([], users);
    }
    return client.jobstatuses.watch(
      result["job_status"].id,
      500,
      5,
      (err, _req, result) => {
        if (err) {
          log(err);
          return cb([], users);
        }
        log(
          `Results from zendesk user creation ${result["job_status"]["results"]}`
        );
        return cb(result["job_status"]["results"], users);
      }
    );
  });
};
