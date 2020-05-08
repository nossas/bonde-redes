/* eslint-disable import/first */
import dotenv from "dotenv";
import { install } from "source-map-support";

install();

dotenv.config();

const {
  ELASTIC_APM_SECRET_TOKEN: secretToken,
  ELASTIC_APM_SERVER_URL: serverUrl,
  ELASTIC_APM_SERVICE_NAME: serviceName
} = process.env;

import apm from "elastic-apm-node";

apm.start({
  secretToken,
  serverUrl,
  serviceName
});

import Server from "./Server";
import checkConfig from "./checkConfig";
import dbg from "./dbg";

try {
  checkConfig();
  Server();
} catch (e) {
  dbg(e);
}
