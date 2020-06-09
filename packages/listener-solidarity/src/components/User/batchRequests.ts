import Bottleneck from "bottleneck";
import { createZendeskUsers } from "./";
// import { User } from "../../types";
import dbg from "../../dbg";
import { handleUserError } from "../../utils";

const log = dbg.extend("batchRequests");

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
});

export default async (users: any) => {
  if (users.length < 1) return undefined;
  log("Performing batch requests to Zendesk...");
  let start = 0;
  const step = 50;
  const usersLength = users.length;
  for (start; start < usersLength; start += step) {
    log({ start, step });
    const batch = users.slice(start, start + step - 1);
    const userCreationResult = await limiter.schedule(() =>
      createZendeskUsers(batch)
    );
    if (!userCreationResult) return handleUserError(users);
    return userCreationResult;
  }
};
