/* eslint-disable import/first */
import dotenv from 'dotenv'

dotenv.config()

const {
  ELASTIC_APM_SECRET_TOKEN: secretToken,
  ELASTIC_APM_SERVER_URL: serverUrl,
  ELASTIC_APM_SERVICE_NAME: serviceName,
} = process.env

import apm from 'elastic-apm-node'

apm.start({
  secretToken,
  serverUrl,
  serviceName,
})

import Server from './Server'

const app = new Server()
app.start()
app.listen()
