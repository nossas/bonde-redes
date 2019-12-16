import assert from 'assert'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import body_parser from 'body-parser'
require('dotenv-safe').config()

import api from './api'
import forward from './forward'

// Assert required enviroment variables for app
assert(process.env.ZENDESK_API_USER !== undefined, 'Required enviroment variable ZENDESK_API_USER')
assert(process.env.ZENDESK_API_TOKEN !== undefined, 'Required enviroment variable ZENDESK_API_TOKEN')
assert(process.env.PORT !== undefined, 'Required enviroment PORT')

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next)
}

const app = express()
const port = process.env.PORT

app.use(body_parser.json())
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'))
app.use(cors())
app.use(express.static(path.resolve(__dirname, '..', 'build')))
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'an error occurred' })
})

app.get('/api', asyncMiddleware(api))
app.post('/api/forward', asyncMiddleware(forward))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

app.listen(port, () => console.log(`Match Voluntarios App listening on port ${port}!`))

// export default app